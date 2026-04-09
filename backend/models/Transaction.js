import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: String, // Wallet address or internal email depending on flow
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Disputed'],
        default: 'Pending'
    },
    txHash: {
        type: String, // On-chain settlement receipt if applicable
        default: ""
    }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
