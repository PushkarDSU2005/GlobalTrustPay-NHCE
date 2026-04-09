import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';

export const getProfile = async (req, res) => {
    try {
        if (!isDbConnected) {
            return res.status(200).json({
                _id: req.user.id,
                email: req.user.email,
                name: req.user.email.split('@')[0],
                trustScore: 85,
                kycStatus: 'Verified'
            });
        }
        const user = await User.findById(req.user.id).select('-__v');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        if (!isDbConnected) {
            // Return updated mock data using info from the token
            return res.status(200).json({
                _id: req.user.id,
                email: updates.email || req.user.email,
                name: updates.name || (req.user.email ? req.user.email.split('@')[0] : 'User'),
                trustScore: 98,
                kycStatus: 'Verified'
            });
        }
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-__v');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (!isDbConnected) {
            return res.status(200).json({ message: 'Mock User data deleted' });
        }
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
