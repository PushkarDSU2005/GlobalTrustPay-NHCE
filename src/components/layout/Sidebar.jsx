import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  PieChart, 
  Wallet, 
  ShieldCheck, 
  Bell, 
  Settings as SettingsIcon, 
  LogOut,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MapIcon, label: 'Transaction Map', path: '/map' },
  { icon: PieChart, label: 'Analytics', path: '/analytics' },
  { icon: Wallet, label: 'My Wallet', path: '/wallet' },
  { icon: ShieldCheck, label: 'Identity (DID)', path: '/identity' },
];

export const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-64 h-full glass-morphism dark:glass-morphism border-r border-white/10 dark:border-white/10 light:bg-white/80 light:backdrop-blur-xl light:border-slate-200 flex flex-col p-6 fixed left-0 top-0 z-50 transition-colors">
      <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
          <Globe size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white dark:text-white light:text-slate-900 italic">GlobalTrust<span className="text-indigo-400">Pay</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 font-bold' 
                : 'text-white/60 dark:text-white/60 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-indigo-600 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-indigo-50'}
            `}
          >
            <item.icon size={20} className="transition-transform group-hover:scale-110" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10 dark:border-white/10 light:border-slate-200">
        <div className="space-y-2">
          <button onClick={() => navigate('/settings')} className="flex items-center gap-4 px-4 py-3 w-full text-white/60 dark:text-white/60 light:text-slate-500 hover:text-white dark:hover:text-white light:hover:text-indigo-600 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-indigo-50 rounded-xl transition-all">
            <SettingsIcon size={20} />
            <span className="font-medium">Settings</span>
          </button>
          <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
