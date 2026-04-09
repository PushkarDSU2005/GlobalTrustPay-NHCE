import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { AIAssistant } from '../ui/AIAssistant';
import { motion } from 'framer-motion';
import videoBg from '../../../assets/f2.mp4';

export const DashboardLayout = () => {
  const location = useLocation();
  
  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/map': return 'Live Transactions';
      case '/analytics': return 'Financial Analytics';
      case '/wallet': return 'My Assets';
      case '/identity': return 'Decentralized Identity';
      case '/settings': return 'Account Settings';
      default: return 'GlobalTrust Pay';
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] dark:bg-[#0f172a] text-white dark:text-white light:bg-slate-50 light:text-slate-900 overflow-hidden font-['Outfit'] perspective-1000">
      {/* Dashboard Video Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-20 scale-105"
        >
          <source src={videoBg} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/95 via-[#0f172a]/80 to-[#0f172a]/95"></div>
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden relative z-10 preserve-3d">
        <TopNav title={getTitle()} />
        <main className="flex-1 overflow-y-auto p-8 relative preserve-3d">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.9, rotateX: 10, translateZ: -100 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, translateZ: 0 }}
            transition={{ duration: 0.6, type: 'spring', damping: 20 }}
            className="tilt-3d"
          >
            <Outlet />
          </motion.div>
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-600/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
};
