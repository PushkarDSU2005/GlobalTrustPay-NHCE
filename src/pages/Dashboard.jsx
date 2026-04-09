import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Sparkles,
  Send,
  Globe
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const TimeZonesPanel = () => {
  const [times, setTimes] = useState({
    IST: '',
    EST: '',
    GMT: '',
    SGT: ''
  });

  useEffect(() => {
    const updateTimes = () => {
      setTimes({
        IST: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' }),
        EST: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit' }),
        GMT: new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour12: false, hour: '2-digit', minute: '2-digit' }),
        SGT: new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour12: false, hour: '2-digit', minute: '2-digit' })
      });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  const zones = [
    { name: 'India', code: 'IST', time: times.IST, flag: '🇮🇳' },
    { name: 'USA', code: 'EST', time: times.EST, flag: '🇺🇸' },
    { name: 'UK', code: 'GMT', time: times.GMT, flag: '🇬🇧' },
    { name: 'Singapore', code: 'SGT', time: times.SGT, flag: '🇸🇬' }
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-white px-2 flex items-center gap-2">
        <Globe size={18} className="text-indigo-400" />
        Global Time Zones
      </h4>
      <div className="grid gap-3">
        {zones.map((z) => (
          <GlassCard key={z.code} className="py-3 px-4 flex items-center justify-between border-white/5 hover:border-indigo-500/20 transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-xl">{z.flag}</span>
              <div>
                <p className="text-sm font-bold text-white dark:text-white light:text-slate-900">{z.name}</p>
                <p className="text-[10px] text-white/40 dark:text-white/40 light:text-slate-500 font-bold uppercase tracking-wider">{z.code}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-mono font-bold text-indigo-400">{z.time}</p>
              <p className="text-[10px] text-white/40 dark:text-white/40 light:text-slate-500 uppercase font-bold tracking-widest">Live</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const avatarInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const [activeContracts] = useState([
    { id: 'SC-9021', name: 'Web3 Platform Design', client: 'Nexus Tech', amount: '2.5 ETH', status: 'Milestone 2/3', type: 'Smart Contract' },
    { id: 'SC-4412', name: 'API Integration', client: 'Global SaaS', amount: '$5,000', status: 'Pending Approval', type: 'Fixed Price' },
  ]);

  return (
    <div className="grid grid-cols-12 gap-6">
      
      {/* LEFT PANEL: User Profile & Trust */}
      <div className="col-span-12 lg:col-span-3 space-y-6">
        <GlassCard className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 font-['Outfit']">
              <div className="w-full h-full rounded-xl bg-[#0f172a] flex items-center justify-center text-3xl font-bold text-white">
                {avatarInitials}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1 border-2 border-[#1e293b]">
              <CheckCircle2 size={16} className="text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white dark:text-white light:text-slate-900">{userName}</h3>
          <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm mb-6 uppercase tracking-wider font-bold">Verified Member</p>
          
          <div className="w-full space-y-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/40 dark:text-white/40 light:text-slate-500">Trust Score</span>
              <span className="text-emerald-400 font-bold">98/100</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '98%' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] rounded border border-indigo-500/20 uppercase font-bold tracking-wider">Top Rated</span>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20 uppercase font-bold tracking-wider">Verified DID</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/20">
          <h4 className="font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-indigo-400" />
            Active Reputation
          </h4>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/40 dark:text-white/40 light:text-slate-500">ID Verification</span>
              <span className="text-emerald-400">Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40 dark:text-white/40 light:text-slate-500">Successful Jobs</span>
              <span className="text-white dark:text-white light:text-slate-900 font-bold">42</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/40 dark:text-white/40 light:text-slate-500">Disputes</span>
              <span className="text-white dark:text-white light:text-slate-900 font-bold">0</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* CENTER PANEL: Wallet & Contracts */}
      <div className="col-span-12 lg:col-span-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="bg-indigo-600/10 border-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Wallet size={80} />
            </div>
            <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">Total Balance (USD)</p>
            <h3 className="text-3xl font-bold text-white dark:text-white light:text-indigo-600 mb-4">$12,450.80</h3>
            <div className="flex gap-2">
              <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-xs font-bold transition-all flex items-center justify-center gap-1">
                <ArrowUpRight size={14} /> Send
              </button>
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 text-xs font-bold transition-all flex items-center justify-center gap-1 border border-white/10">
                <ArrowDownLeft size={14} /> Receive
              </button>
            </div>
          </GlassCard>

          <GlassCard className="bg-amber-600/10 border-amber-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-amber-500">
              <RefreshCcw size={80} />
            </div>
            <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm mb-1 uppercase tracking-wider font-bold">Crypto Balance (ETH)</p>
            <h3 className="text-3xl font-bold text-white dark:text-white light:text-amber-600 mb-4">4.25 ETH</h3>
             <Button variant="secondary" className="w-full py-2 text-xs font-bold flex items-center justify-center gap-2">
              <RefreshCcw size={14} /> Convert Currency
            </Button>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-lg font-bold text-white dark:text-white light:text-slate-900">Active Smart Contracts</h4>
            <button className="text-indigo-400 text-sm hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            {activeContracts.map((contract) => (
              <GlassCard key={contract.id} className="py-4 px-5 border-white/5 hover:border-indigo-500/30 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 dark:bg-white/5 light:bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h5 className="font-bold text-white dark:text-white light:text-slate-900">{contract.name}</h5>
                      <p className="text-xs text-white/40 dark:text-white/40 light:text-slate-500">{contract.client} • {contract.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white dark:text-white light:text-slate-900">{contract.amount}</p>
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">{contract.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="px-3 py-1.5 text-[10px] font-bold">Details</Button>
                    <Button variant="accent" className="px-3 py-1.5 text-[10px] font-bold transition-all hover:neon-glow">Release</Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Global Time Zones */}
      <div className="col-span-12 lg:col-span-3 h-[calc(100vh-200px)] flex flex-col">
        <TimeZonesPanel />
        <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3">
          <AlertCircle size={20} className="text-amber-500 shrink-0" />
          <div>
             <h5 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Fraud Detection</h5>
             <p className="text-[10px] text-white/60">New account "Z-Cloud" flagged. Verify history before accepting contract.</p>
          </div>
        </div>
      </div>

    </div>
  );
}