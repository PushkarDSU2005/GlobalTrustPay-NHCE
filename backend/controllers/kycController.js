import KYC from '../models/KYC.js';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';

// Setup Mock Local Storage for hackathon
const storage = multer.diskStorage({
    destination: './uploads/kyc',
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const uploadConfig = multer({ storage });

export const uploadKYC = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No document uploaded' });

        const documentUrl = `/uploads/kyc/${req.file.filename}`;

        // Upsert KYC doc
        let kyc = await KYC.findOne({ userId: req.user.id });
        if (kyc) {
            kyc.documentUrl = documentUrl;
            kyc.status = 'Pending';
            await kyc.save();
        } else {
            kyc = await KYC.create({
                userId: req.user.id,
                documentUrl,
                status: 'Pending'
            });
        }

        // Update User
        await User.findByIdAndUpdate(req.user.id, { kycStatus: 'Pending' });

        res.status(200).json({ message: 'KYC Document submitted successfully', kyc });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getKycStatus = async (req, res) => {
    try {
        const kyc = await KYC.findOne({ userId: req.user.id });
        if (!kyc) return res.status(404).json({ status: 'Unsubmitted' });
        res.status(200).json(kyc);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
