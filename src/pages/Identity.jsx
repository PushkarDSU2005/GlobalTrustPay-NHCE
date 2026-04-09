import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, FileText, Globe, CheckCircle2, ArrowRight, User, Smartphone, Cpu } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';

export default function Identity() {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [did, setDid] = useState(null);

  const startVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
      setDid('did:gtp:zK84jX...9f2L');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-white mb-2">Decentralized Trust ID</h3>
        <p className="text-white/40">Secure your digital professional presence on the global ledger.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Progress */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {[
            { id: 1, label: 'Profile Information', icon: User },
            { id: 2, label: 'Biometric Link', icon: Fingerprint },
            { id: 3, label: 'Zero-Knowledge Proof', icon: ShieldCheck },
          ].map((s) => (
            <div 
              key={s.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                step === s.id 
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-white' 
                  : step > s.id 
                    ? 'bg-white/5 border-emerald-500/30 text-emerald-400' 
                    : 'bg-white/5 border-white/5 text-white/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                step === s.id ? 'bg-indigo-600 shadow-lg shadow-indigo-500/40' : 'bg-white/5'
              }`}>
                {step > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
              </div>
              <span className="font-bold text-sm tracking-wide uppercase">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Right Column: Content */}
        <div className="col-span-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard className="space-y-6">
                  <h4 className="text-xl font-bold text-white mb-6">Basic Identity Info</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest pl-1">Full Name</label>
                      <input type="text" placeholder="Alex Sterling" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-600/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest pl-1">Professional Title</label>
                      <input type="text" placeholder="Frontend Developer" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-600/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest pl-1">Global Wallet (Public Key)</label>
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-indigo-400 font-mono">
                      0x71C4B43628b375BC49C2932224BC2e94f24e2d
                    </div>
                  </div>
                  <Button className="w-full py-3" onClick={() => setStep(2)}>Next Step <ArrowRight size={18} className="inline ml-2" /></Button>
                </GlassCard>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard className="text-center py-10">
                  <div className="relative inline-block mb-8">
                    <div className={`w-32 h-32 rounded-full border-2 p-1 ${isVerifying ? 'border-indigo-500 animate-spin' : 'border-white/10'}`}>
                      <div className="w-full h-full rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                        <Fingerprint size={64} />
                      </div>
                    </div>
                    {isVerifying && (
                      <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/20 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Simulate Biometric Hash</h4>
                  <p className="text-white/40 text-sm mb-10 max-w-sm mx-auto">Click below to simulate secure biometric binding to your decentralized identity.</p>
                  
                  {isVerifying ? (
                    <div className="text-indigo-400 font-bold animate-pulse">Scanning and hashing data...</div>
                  ) : (
                    <div className="flex gap-4">
                       <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                       <Button variant="primary" className="flex-1" onClick={startVerification}>Identify Me</Button>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <GlassCard className="text-center space-y-8 bg-emerald-500/5 border-emerald-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck size={200} className="text-emerald-500" />
                  </div>
                  
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/40">
                    <CheckCircle2 size={40} />
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">DID Created Successfully!</h4>
                    <p className="text-white/40 text-sm">Your identity is now anchored on the GlobalTrust Ledger.</p>
                  </div>

                  <div className="bg-black/20 p-6 rounded-2xl border border-white/5 text-left space-y-4">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Decentralized ID</p>
                      <p className="text-indigo-400 font-mono text-sm break-all">{did}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Reputation Score</p>
                        <p className="text-emerald-400 font-bold text-xl">85/100 (New User)</p>
                      </div>
                      <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/60">
                        Z-PROOF ACTIVE
                      </div>
                    </div>
                  </div>

                  <Button variant="primary" className="w-full py-3" onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</Button>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Simulation Info */}
      <div className="mt-12 p-6 glass-card bg-indigo-600/5 border-indigo-500/10 flex gap-6 items-start">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 shrink-0">
          <Cpu size={24} />
        </div>
        <div>
          <h5 className="font-bold text-white mb-1 tracking-wide">Technical Simulator Note</h5>
          <p className="text-sm text-white/40 leading-relaxed">This demonstration simulates the generation of an ERC-725/735 compatible DID using Zero-Knowledge proofs. In a production environment, this would involve complex biometric hardware integration and off-chain relayers.</p>
        </div>
      </div>
    </div>
  );
}