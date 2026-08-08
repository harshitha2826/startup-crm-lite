import app from '../backend/server.js';
import connectDB from '../backend/config/database.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
    } catch (error) {
      console.error('Vercel Serverless Mongo Connection Error:', error);
    }
  }
  return app(req, res);
}
