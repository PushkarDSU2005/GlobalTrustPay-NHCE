import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    documentUrl: {
        type: String, // Mock local upload path or cloudinary URL
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    }
}, { timestamps: true });

export default mongoose.model('KYC', kycSchema);
