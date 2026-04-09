import mongoose from 'mongoose';

const reputationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    score: {
        type: Number,
        default: 50 // 0 to 100 benchmark
    },
    completedJobs: {
        type: Number,
        default: 0
    },
    disputes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model('Reputation', reputationSchema);
