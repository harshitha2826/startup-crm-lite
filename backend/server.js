import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables dynamically relative to the backend folder
dotenv.config({ path: join(__dirname, '.env') });

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─── Environment Variable Validation ─────────────────────────────────────────

/**
 * Validates that essential configuration variables are loaded.
 * Prevents accidental deployments with missing environment setups.
 */
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((varName) => !process.env[varName]);
  if (missing.length > 0) {
    console.error(`CRITICAL CONFIG ERROR: Missing required environment variables: ${missing.join(', ')}`);
  }
};

// ─── Security and Utility Middlewares ─────────────────────────────────────────

// Sets secure HTTP response headers to defend against various web vulnerabilities
app.use(helmet());

/**
 * MongoDB injection protection (Express 5 compatible).
 *
 * express-mongo-sanitize normally replaces req.query entirely, but Express 5
 * makes req.query a read-only getter — doing `req.query = ...` throws a TypeError.
 * Instead we sanitize req.body and req.params by reassignment (both are writable),
 * and sanitize req.query by mutating the existing object in-place.
 */
app.use((req, res, next) => {
  // Sanitize req.body (writable — safe to reassign)
  if (req.body && typeof req.body === 'object') {
    req.body = mongoSanitize.sanitize(req.body);
  }
  // Sanitize req.params (writable — safe to reassign)
  if (req.params && typeof req.params === 'object') {
    req.params = mongoSanitize.sanitize(req.params);
  }
  // Sanitize req.query in-place (Express 5 read-only getter — must NOT reassign)
  if (req.query && typeof req.query === 'object') {
    const sanitized = mongoSanitize.sanitize({ ...req.query });
    // Remove all existing keys first, then copy sanitized ones back in
    Object.keys(req.query).forEach((key) => { delete req.query[key]; });
    Object.assign(req.query, sanitized);
  }
  next();
});

// Rate Limiting to prevent brute-force attacks and abuse
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests for auth routes per window
  message: {
    success: false,
    message: 'Too many auth attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Update CORS configuration for production environments
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.vercel.app',
  'http://localhost:5173', // Keep standard localhost client port
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, postman) or matching allowed origins
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin ${origin} not allowed by production policy`));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// HTTP request logging configured based on environment
if (NODE_ENV === 'production') {
  app.use(morgan('combined')); // Detailed production logging
} else {
  app.use(morgan('dev')); // Concise, colorized development logging
}

// Parses incoming JSON payloads with a strict limit to prevent denial-of-service (DoS)
app.use(express.json({ limit: '10kb' }));

// Parses URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ─── Health Check Endpoint ───────────────────────────────────────────────────

/**
 * GET /api/health
 * Simple health indicator to verify the container/app is responsive.
 */
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ─── Error Handling Middleware ────────────────────────────────────────────────

// The global error handler must be registered last to catch all unhandled route errors
app.use(errorHandler);

// ─── Server Bootstrapping and Graceful Shutdown ──────────────────────────────

let server;

const startServer = async () => {
  // 1. Verify required environment variables are set before starting
  checkRequiredEnvVars();

  // 2. Connect to MongoDB; ensure database is up before accepting traffic
  await connectDB();

  // 3. Start listening for network requests
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

/**
 * Cleanly closes database connections and shuts down the process.
 * @param {string} signal - The signal that triggered the shutdown (SIGINT/SIGTERM)
 */
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Server shutting down gracefully...`);
  
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
    });
  }

  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection during shutdown:', error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

if (!process.env.VERCEL) {
  startServer();
}

export default app;
