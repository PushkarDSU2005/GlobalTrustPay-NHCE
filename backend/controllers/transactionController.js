import Transaction from '../models/Transaction.js';

export const createTransaction = async (req, res) => {
    try {
        const { receiver, amount, currency, txHash } = req.body;
        const tx = await Transaction.create({
            sender: req.user.id,
            receiver,
            amount,
            currency,
            txHash
        });
        res.status(201).json(tx);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getHistory = async (req, res) => {
    try {
        // Find transactions where user is sender
        const history = await Transaction.find({ sender: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
