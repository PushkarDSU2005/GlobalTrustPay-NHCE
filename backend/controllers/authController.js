import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_secret_fallback';
// Temporary in-memory store for OTPs (since they expire fast)
const otps = new Map();

export const sendOtp = async (req, res) => {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail.toLowerCase();
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

        otps.set(email, { otp: hashedOtp, expiresAt });

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });
            await transporter.sendMail({
                from: `GlobalTrustPay <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'GlobalTrustPay Login OTP',
                text: `Your login OTP is: ${otp}`
            });
            console.log(`✅ LIVE OTP SENT: ${otp} to ${email}`);
        } else {
            console.log(`\n=== MOCK EMAIL OTP: ${otp} for ${email} ===\n`);
        }

        res.status(200).json({ message: 'OTP sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email: rawEmail, otp } = req.body;
        const email = rawEmail.toLowerCase();
        if (!email || !otp) return res.status(400).json({ error: 'Missing parameters' });

        console.log(`Checking OTP for: ${email}`);
        console.log(`Current keys in mem: ${Array.from(otps.keys())}`);

        const storedData = otps.get(email);
        if (!storedData) {
            console.log(`❌ No OTP found in memory for ${email}. Did the server restart?`);
            return res.status(400).json({ error: 'No OTP requested for this email. Please click "Send" again.' });
        }
        
        if (Date.now() > storedData.expiresAt) {
            otps.delete(email);
            return res.status(400).json({ error: 'OTP expired' });
        }

        const isValid = await bcrypt.compare(otp, storedData.otp);
        if (!isValid) return res.status(400).json({ error: 'Invalid OTP' });
        
        otps.delete(email);

        // Find or create User - Fallback to Mock if DB is offline
        let user;
        if (isDbConnected) {
            user = await User.findOne({ email });
            if (!user) {
                user = await User.create({ email, name: email.split('@')[0] });
            }
        } else {
            console.log("🛠️ Using Mock User because MongoDB is offline.");
            user = {
                _id: '507f1f77bcf86cd799439011', // Valid 24-character hex string
                email: email,
                name: email.split('@')[0],
                trustScore: 85,
                kycStatus: 'Verified'
            };
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ message: 'Success', token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
