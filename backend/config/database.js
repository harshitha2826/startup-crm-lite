import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables dynamically relative to the backend folder
dotenv.config({ path: join(__dirname, '../.env') });

const DEFAULT_MONGODB_URI = 'mongodb://harshi_26:Harshi26@ac-lv5kvcj-shard-00-00.htndkna.mongodb.net:27017,ac-lv5kvcj-shard-00-01.htndkna.mongodb.net:27017,ac-lv5kvcj-shard-00-02.htndkna.mongodb.net:27017/M0?tls=true&replicaSet=atlas-a0ggdu-shard-0&authSource=admin';

/**
 * Connects to MongoDB Atlas using the configured connection string.
 * Logs the connected host on success.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
