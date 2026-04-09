import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Globe, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const transactions = [
  { id: 'TX-8821', from: [78.9629, 20.5937], to: [-100.0336, 38.9072], fromName: "India", toName: "USA", amount: "$4,500", color: "#6366f1", gas: "0.002 ETH", chain: "Ethereum Mainnet", time: "2m ago" },
  { id: 'TX-3342', from: [-3.7038, 40.4168], to: [103.8198, 1.3521], fromName: "Spain", toName: "Singapore", amount: "1.2 ETH", color: "#10b981", gas: "0.0005 ETH", chain: "Polygon PoS", time: "15m ago" },
  { id: 'TX-9012', from: [13.4050, 52.5200], to: [126.9780, 37.5665], fromName: "Germany", toName: "South Korea", amount: "$12,000", color: "#f59e0b", gas: "0.005 ETH", chain: "Arbitrum One", time: "45m ago" },
  { id: 'TX-2210', from: [-46.6333, -23.5505], to: [4.8952, 52.3702], fromName: "Brazil", toName: "Netherlands", amount: "0.85 ETH", color: "#3b82f6", gas: "0.0012 ETH", chain: "Base", time: "1h ago" },
];

export default function TransactionMap() {
  const [selectedTx, setSelectedTx] = useState(null);
  const [zoom, setZoom] = useState(1);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 mb-2">Network Global Live</h3>
          <p className="text-white/40 dark:text-white/40 light:text-slate-500 text-sm">Real-time cross-border settlements across the decentralized network.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase">Live Settlements</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 relative">
          <GlassCard className="p-0 overflow-hidden bg-white/[0.02] border-white/5 relative h-[600px] flex items-center justify-center">
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <button 
                onClick={() => setZoom(z => Math.min(z + 0.5, 4))}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white"
              >
                +
              </button>
              <button 
                onClick={() => setZoom(z => Math.max(z - 0.5, 1))}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white"
              >
                -
              </button>
            </div>

            {/* React Simple Maps Implementation */}
            <div className="w-full h-full absolute inset-0 py-8 opacity-80 cursor-grab active:cursor-grabbing">
              <ComposableMap projection="geoMercator">
                <motion.g animate={{ scale: zoom }}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#1e293b"
                          stroke="#334155"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#312e81", outline: "none" },
                            pressed: { fill: "#3730a3", outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* Animated Paths and Markers */}
                  {transactions.map((t, i) => (
                    <g 
                      key={i} 
                      onClick={() => setSelectedTx(t)}
                      className="cursor-pointer group"
                    >
                      {/* Animated Line */}
                      <Line
                        from={t.from}
                        to={t.to}
                        stroke={t.color}
                        strokeWidth={selectedTx?.id === t.id ? 4 : 2}
                        strokeLinecap="round"
                      >
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.8 }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            repeatType: "loop", 
                            ease: "easeInOut",
                            delay: i * 0.5 
                          }}
                          style={{ strokeDasharray: "6 6" }}
                        />
                      </Line>

                      {/* From Marker */}
                      <Marker coordinates={t.from}>
                        <circle r={4} fill={t.color} />
                        <circle r={12} fill={t.color} opacity={0.3} className="animate-ping" />
                      </Marker>
                      
                      {/* To Marker */}
                      <Marker coordinates={t.to}>
                        <circle r={4} fill={t.color} />
                        <circle r={8} fill={t.color} opacity={0.5} className="animate-pulse" />
                      </Marker>
                    </g>
                  ))}
                </motion.g>
              </ComposableMap>
            </div>

            {/* Map Overlay Text */}
            <div className="absolute bottom-8 left-8 space-y-2 pointer-events-none">
              <div className="flex items-center gap-3 bg-[#0f172a]/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Globe size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Global Nodes</p>
                  <p className="text-sm font-bold text-white">1,242 Active Validators</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Transaction Info Sidebar (Inside Map) */}
          <AnimatePresence>
            {selectedTx && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-0 right-0 h-full w-80 z-30 p-6"
              >
                <GlassCard className="h-full border-l border-white/20 dark:border-white/20 light:border-slate-200 bg-slate-900/90 dark:bg-slate-900/90 light:bg-white/95 backdrop-blur-2xl flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-white dark:text-white light:text-slate-900">Route Details</h4>
                    <button onClick={() => setSelectedTx(null)} className="text-white/40 hover:text-white">✕</button>
                  </div>

                  <div className="space-y-6 flex-1 overflow-y-auto pr-2">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[10px] text-white/40 uppercase font-bold mb-2">Transaction ID</p>
                      <p className="font-mono text-xs text-indigo-400 truncate">{selectedTx.id}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="text-[10px] text-white/40 uppercase font-bold">Source</p>
                        <p className="text-sm font-bold text-white">{selectedTx.fromName}</p>
                      </div>
                      <ArrowRight size={20} className="text-indigo-500 animate-pulse" />
                      <div className="text-center flex-1">
                        <p className="text-[10px] text-white/40 uppercase font-bold">Destination</p>
                        <p className="text-sm font-bold text-white">{selectedTx.toName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Amount</p>
                        <p className="font-bold text-white text-sm">{selectedTx.amount}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Fee</p>
                        <p className="font-bold text-emerald-400 text-sm">{selectedTx.gas}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Network</span>
                        <span className="text-white font-medium">{selectedTx.chain}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Timestamp</span>
                        <span className="text-white font-medium">{selectedTx.time}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Status</span>
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">Success</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="primary" className="w-full mt-6">View on Explorer</Button>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-4">
          <h4 className="font-bold text-white dark:text-white light:text-slate-900 px-2">Recent Settlements</h4>
          {transactions.map((t, i) => (
            <motion.div
              key={i}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <GlassCard className="py-3 px-4 flex items-center justify-between border-white/5 dark:border-white/5 light:border-slate-200 hover:border-indigo-500/20 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-white dark:text-white light:text-slate-900 mb-1">
                    <span>{t.fromName}</span>
                    <ArrowRight size={10} className="text-white/40 dark:text-white/40 light:text-slate-400" />
                    <span>{t.toName}</span>
                  </div>
                  <p className="text-[10px] text-white/40 dark:text-white/40 light:text-slate-500 italic">Settled via Smart ID</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold truncate max-w-[80px]" style={{ color: t.color }}>{t.amount}</p>
                  <p className="text-[10px] text-white/40">2m ago</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          <div className="pt-4">
            <GlassCard className="bg-gradient-to-br from-emerald-600/20 to-transparent border-emerald-500/20">
               <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="text-emerald-400" />
                 <h5 className="font-bold text-white dark:text-white light:text-slate-900">Zero-Knowledge Verification</h5>
               </div>
               <p className="text-xs text-white/60 dark:text-white/60 light:text-slate-500 mb-4">Each line represents a cryptographically secured private bridge between freelancers and enterprise systems.</p>
               <Button variant="accent" className="w-full py-2 text-xs text-black font-bold bg-emerald-400 hover:bg-emerald-300">Verify Network Status</Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}