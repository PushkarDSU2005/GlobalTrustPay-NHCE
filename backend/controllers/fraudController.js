import axios from 'axios';

// Communicate with the internal Python Microservice
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export const checkFraud = async (req, res) => {
    try {
        const { amount, country, frequency, user_trust_score } = req.body;
        
        // Ensure the fields are numbers where applicable
        const response = await axios.post(`${ML_SERVICE_URL}/fraud/predict`, {
            amount: parseFloat(amount),
            country: country,
            frequency: parseInt(frequency),
            user_trust_score: parseFloat(user_trust_score)
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('ML Service Error:', error.message);
        // Fallback gracefully if Python microservice is not running
        res.status(200).json({
            risk_level: "Low",
            risk_score: 0.1,
            analysis: "Python ML Service unreachable. Mocking low risk."
        });
    }
};
