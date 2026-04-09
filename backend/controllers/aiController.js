import OpenAI from 'openai';

let openai;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const systemPrompt = `You are TrustAI, a fintech expert. You help freelancers with fraud detection, payment safety, currency optimization, and smart contract advice.
Always return: answer, risk level (Low/Medium/High), recommendation.
Respond in pure JSON: {"answer": "...", "risk": "Low/Medium/High", "suggestion": "..."}`;

export const aiQuery = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        if (!openai) {
            return res.status(200).json({
                answer: "I am TrustAI (Mock Mode). Configure OPENAI_API_KEY in .env for real responses.",
                risk: "Low",
                suggestion: "Please connect an active API key to evaluate live network metrics."
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        res.status(200).json(JSON.parse(response.choices[0].message.content));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
