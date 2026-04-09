import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, ArrowRight, Loader2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendOtp(email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await verifyOtp(email, otp);
      onClose();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm perspective-1000">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="relative w-full max-w-md p-8 overflow-hidden bg-slate-900/80 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl backdrop-blur-2xl preserve-3d"
        >
          {/* Background effects */}
          <div className="absolute top-[-50px] left-[-50px] w-[200px] h-[200px] bg-indigo-600/30 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-[200px] h-[200px] bg-amber-500/20 rounded-full blur-[80px] pointer-events-none"></div>

          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-sm text-white/60">
                {step === 1 ? 'Enter your email to receive a secure login code' : `We sent a code to ${email}`}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || !email}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Magic Link'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                    <KeyRound size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] text-center tracking-widest font-mono text-lg transition-all"
                    maxLength={6}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading || otp.length < 6}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Login'}
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-white/40 hover:text-white">
                    Need to use a different email?
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
