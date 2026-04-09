import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { GlassCard } from '../components/ui/GlassCard';
import { TrendingUp, ArrowDown, DollarSign, Zap, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const dataWeekly = [
  { name: 'Mon', earnings: 400, savings: 24 },
  { name: 'Tue', earnings: 300, savings: 13 },
  { name: 'Wed', earnings: 200, savings: 98 },
  { name: 'Thu', earnings: 278, savings: 39 },
  { name: 'Fri', earnings: 189, savings: 48 },
  { name: 'Sat', earnings: 239, savings: 38 },
  { name: 'Sun', earnings: 349, savings: 43 },
];

const dataMonthly = [
  { name: 'Week 1', earnings: 1400, savings: 124 },
  { name: 'Week 2', earnings: 1300, savings: 113 },
  { name: 'Week 3', earnings: 2200, savings: 198 },
  { name: 'Week 4', earnings: 2780, savings: 239 },
];

const dataAllTime = [
  { name: 'Jan', earnings: 4000, savings: 240 },
  { name: 'Feb', earnings: 3000, savings: 139 },
  { name: 'Mar', earnings: 2000, savings: 980 },
  { name: 'Apr', earnings: 2780, savings: 390 },
  { name: 'May', earnings: 1890, savings: 480 },
  { name: 'Jun', earnings: 2390, savings: 380 },
  { name: 'Jul', earnings: 3490, savings: 430 },
  { name: 'Aug', earnings: 4200, savings: 550 },
  { name: 'Sep', earnings: 5100, savings: 600 },
];

const compareData = [
  { name: 'Traditional Banks', fee: 8.5, color: '#f87171' },
  { name: 'Wise/Payoneer', fee: 3.2, color: '#fbbf24' },
  { name: 'GlobalTrust Pay', fee: 0.8, color: '#10b981' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-white font-bold mb-1">{label}</p>
        <p className="text-indigo-400 font-bold">Earnings: ${payload[0].value.toLocaleString()}</p>
        <p className="text-emerald-400 font-bold text-xs mt-1">Fee Savings: +${payload[1].value}</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState('7d');
  
  const currentData = 
    timeFilter === '7d' ? dataWeekly :
    timeFilter === '30d' ? dataMonthly :
    dataAllTime;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Financial Insights</h3>
          <p className="text-white/40 text-sm">Visualize your earnings growth and cross-border fee efficiency.</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button 
            onClick={() => setTimeFilter('7d')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeFilter === '7d' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setTimeFilter('30d')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeFilter === '30d' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            30 Days
          </button>
          <button 
            onClick={() => setTimeFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeFilter === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="col-span-12 lg:col-span-8">
          <GlassCard className="h-[450px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-bold text-white">Earnings & Savings Over Time</h4>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-xs text-white/40">Earnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-white/40">Savings</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full" style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#ffffff40', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#ffffff40', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorEarnings)" 
                    animationDuration={1500}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSavings)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Right Sidebar Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <GlassCard className="bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-indigo-400 uppercase font-bold tracking-widest">Growth</p>
                <h4 className="text-2xl font-bold text-white">+24.5%</h4>
              </div>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">Your earnings are increasing faster than average freelancers in your region. Consider higher rate benchmarks.</p>
          </GlassCard>

          <GlassCard className="border-white/5 space-y-6">
            <h4 className="font-bold text-white">Fee Comparison (% Loss)</h4>
            <div className="space-y-4">
              {compareData.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60 font-medium">{item.name}</span>
                    <span className="text-white font-bold">{item.fee}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.fee * 10}%` }}
                      transition={{ duration: 1, delay: idx * 0.2 }}
                      style={{ backgroundColor: item.color }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Zap size={20} />
              </div>
              <p className="text-xs text-white/60">Using <span className="text-emerald-400 font-bold">DirectSettlement™</span> has saved you $1,240 this year.</p>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex items-center gap-4 border-white/5 group hover:border-indigo-500/30 transition-all">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Total Earned</p>
            <h4 className="text-xl font-bold text-white">$48,250</h4>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4 border-white/5 group hover:border-emerald-500/30 transition-all">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Landmark size={24} />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Withdrawn</p>
            <h4 className="text-xl font-bold text-white">$36,000</h4>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 border-white/5 group hover:border-cyan-500/30 transition-all">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <ArrowDown size={24} />
          </div>
          <div>
            <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Average Fee</p>
            <h4 className="text-xl font-bold text-white">0.45%</h4>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}