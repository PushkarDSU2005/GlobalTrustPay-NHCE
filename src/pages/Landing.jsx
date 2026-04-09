import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, Zap, ArrowRight, Wallet } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '../components/auth/AuthModal';

import videoBg from '../../assets/f1.mp4';

export default function Landing() {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] overflow-hidden relative font-['Outfit'] perspective-1000">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-30 scale-105"
        >
          <source src={videoBg} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-transparent to-[#0f172a]"></div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] z-0 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] z-0 animate-pulse"></div>
      
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-10 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Globe size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white italic">GlobalTrust<span className="text-indigo-400">Pay</span></h1>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-white/60 font-medium">
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Developers</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setIsAuthModalOpen(true)}>Login</Button>
          <Button variant="primary" className="flex items-center gap-2" onClick={() => setIsAuthModalOpen(true)}>
            <Wallet size={18} />
            <span>Launch App</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-10 pt-20 pb-32 flex flex-col items-center text-center preserve-3d">
        <div className="tilt-3d flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
          >
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-indigo-300 tracking-wide uppercase">Next-Gen Blockchain Workforce</span>
          </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight tracking-tight"
        >
          Borderless Payments.<br />
          <span className="gradient-text">Trustworthy Work.</span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-white/50 max-w-2xl mb-12 leading-relaxed"
        >
          The blockchain-enabled financial engine for the global freelance economy. 
          Send, receive, and secure payments with decentralized identity and AI trust scoring.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-24"
        >
          <Button variant="primary" className="px-10 py-4 text-lg flex items-center gap-3 shadow-xl" onClick={() => setIsAuthModalOpen(true)}>
            Connect Wallet <ArrowRight size={20} />
          </Button>
          <Button variant="outline" className="px-10 py-4 text-lg border-white/10 bg-white/5" onClick={() => setIsAuthModalOpen(true)}>
            Create Secure Identity
          </Button>
        </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 w-full">
          <GlassCard className="text-left group border-indigo-500/5">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:shadow-lg group-hover:shadow-indigo-500/40 transition-all duration-300">
              <Shield className="text-indigo-400 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Decentralized Trust</h3>
            <p className="text-white/40 leading-relaxed">Build your reputation with on-chain DID and AI-verified project history.</p>
          </GlassCard>

          <GlassCard className="text-left group border-emerald-500/5">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-500/40 transition-all duration-300">
              <Zap className="text-emerald-400 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instant Conversion</h3>
            <p className="text-white/40 leading-relaxed">Receive payments in ETH or USD and convert instantly to local currencies like INR.</p>
          </GlassCard>

          <GlassCard className="text-left group border-amber-500/5">
            <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:shadow-lg group-hover:shadow-amber-500/40 transition-all duration-300">
              <Globe className="text-amber-400 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Escrow</h3>
            <p className="text-white/40 leading-relaxed">Secure your work with milestone-based smart contracts that release payments automatically.</p>
          </GlassCard>
        </div>
      </main>

      {/* Floating Blobs for extra wow */}
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}