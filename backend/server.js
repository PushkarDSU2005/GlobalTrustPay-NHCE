import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import { sendOtp, verifyOtp } from './controllers/authController.js';
import { getProfile, updateProfile, deleteUser } from './controllers/userController.js';
import { createTransaction, getHistory } from './controllers/transactionController.js';
import { aiQuery } from './controllers/aiController.js';
import { checkFraud } from './controllers/fraudController.js';
import { uploadConfig, uploadKYC, getKycStatus } from './controllers/kycController.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
// Serve static uploads
app.use('/uploads', express.static('uploads'));

// ==========================================
// ROUTES
// ==========================================

// AUTH
app.post('/api/auth/send-otp', sendOtp);
app.post('/api/auth/verify-otp', verifyOtp);

// USER
app.get('/api/user/profile', protect, getProfile);
app.put('/api/user/update', protect, updateProfile);
app.delete('/api/user/delete', protect, deleteUser);

// TRANSACTIONS
app.post('/api/transaction/create', protect, createTransaction);
app.get('/api/transaction/history', protect, getHistory);

// AI & FRAUD
app.post('/api/ai/query', protect, aiQuery);
app.post('/api/fraud/predict', protect, checkFraud);

// KYC
app.post('/api/kyc/upload', protect, uploadConfig.single('document'), uploadKYC);
app.get('/api/kyc/status', protect, getKycStatus);


// Root ping
app.get('/', (req, res) => {
  res.json({ message: 'GlobalTrustPay V2 Backend API Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
