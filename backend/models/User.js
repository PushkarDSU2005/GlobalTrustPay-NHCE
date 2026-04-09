import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: false
    },
    walletAddress: {
        type: String,
        default: ""
    },
    trustScore: {
        type: Number,
        default: 50
    },
    kycStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected', 'Unsubmitted'],
        default: 'Unsubmitted'
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
