import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export let isDbConnected = false;

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/globaltrustpay';
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        isDbConnected = true;
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        isDbConnected = false;
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        console.log("⚠️ STARTING IN MOCK-DB MODE: MongoDB not found. User data will not persist.");
    }
};

export default connectDB;
