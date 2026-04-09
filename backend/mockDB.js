// In-memory data structures for Hackathon use
// Stores user data: email -> { id, email, name, createdAt }
export const users = new Map();

// Stores OTPs: email -> { otp, expiresAt }
export const otps = new Map();

// Pre-populate some dummy user if needed
users.set('test@example.com', {
  id: 'usr_123',
  email: 'test@example.com',
  name: 'Test Freelancer',
  createdAt: Date.now()
});
