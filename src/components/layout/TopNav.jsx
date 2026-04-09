import { Bell, Search, User, ChevronDown, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useWeb3 } from '../../context/Web3Context';
import { useAuth } from '../../context/AuthContext';

export const TopNav = ({ title = "Dashboard" }) => {
  const { connectWallet, account, balance, network, isConnecting } = useWeb3();
  const { user } = useAuth();
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const avatarInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const shortenAddress = (addr) => {
    return `${addr.slice(0, 5)}...${addr.slice(-4)}`;
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-white/10 dark:border-white/10 light:border-slate-200">
      <div>
        <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">{title}</h2>
        <div className="flex items-center gap-2">
          {network && (
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20">
              {network}
            </span>
          )}
          <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm italic font-medium">Welcome back, <span className="text-indigo-400">{userName}</span>!</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-600/50 w-64 transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 py-2 px-4 text-sm border-white/10 bg-white/5 hover:bg-white/10"
            onClick={connectWallet}
            disabled={isConnecting}
          >
            <Wallet size={16} className="text-indigo-400" />
            {account ? (
              <span className="flex items-center gap-2">
                <span className="text-white/60 text-xs hidden md:inline">{balance} ETH</span>
                <span className="font-mono">{shortenAddress(account)}</span>
              </span>
            ) : (
              <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            )}
          </Button>
          
          <button className="relative p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>

          <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

          <button className="flex items-center gap-3 p-1 pl-1 pr-3 hover:bg-white/5 rounded-full transition-all group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10 group-hover:ring-indigo-500/50 transition-all font-['Outfit']">
              {avatarInitials}
            </div>
            <ChevronDown size={14} className="text-white/40 group-hover:text-white transition-all" />
          </button>
        </div>
      </div>
    </header>
  );
};
