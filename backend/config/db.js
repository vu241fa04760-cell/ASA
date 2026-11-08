const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_study_db', {
      serverSelectionTimeoutMS: 6000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Warning]: ${error.message}`);
    console.log(`[MongoDB Note] If local MongoDB is not running, please set MONGODB_URI in backend/.env to your MongoDB Atlas connection string.`);
    // We do not exit process immediately so server can serve health checks or inform clients gracefully
    return null;
  }
};

module.exports = connectDB;
