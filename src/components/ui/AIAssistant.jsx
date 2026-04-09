import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    { role: 'assistant', text: "Hi! I'm TrustAI. How can I help you navigate cross-border payments or analyze transaction risks today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [history, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/ai/query', { message: userMessage });
      const { answer, risk, suggestion } = res.data;
      
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        text: answer,
        risk,
        suggestion 
      }]);
    } catch (error) {
      setHistory(prev => [...prev, { 
        role: 'assistant', 
        text: 'Sorry, I am currently offline or experiencing network issues.', 
        error: true 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    if (!risk) return '';
    const r = risk.toLowerCase();
    if (r === 'low') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (r === 'medium') return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (r === 'high') return 'text-red-400 border-red-500/30 bg-red-500/10';
    return '';
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_#4f46e550] hover:scale-110 transition-transform ${isOpen ? 'hidden' : 'block'}`}
        >
          <Bot size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] z-50 flex flex-col bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-indigo-600/20 border-b border-indigo-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">TrustAI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-white/50">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {history.map((msg, idx) => (
                <div key={idx} className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                  {msg.role === 'user' ? (
                    <div className="bg-indigo-600 text-white text-sm p-3 rounded-2xl rounded-tr-none">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="space-y-2 relative">
                      <div className={`bg-white/5 border ${msg.error ? 'border-red-500/50' : 'border-white/10'} text-white/80 text-sm p-3 rounded-2xl rounded-tl-none`}>
                        {msg.text}
                      </div>
                      
                      {/* Formatted risk/suggestion tags */}
                      {(msg.risk || msg.suggestion) && (
                        <div className="space-y-1.5 mt-2">
                          {msg.risk && (
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getRiskColor(msg.risk)}`}>
                              <AlertCircle size={10} /> Risk: {msg.risk}
                            </div>
                          )}
                          {msg.suggestion && (
                            <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-lg">
                              <p className="text-[10px] text-indigo-300 font-bold uppercase mb-1">💡 Suggestion</p>
                              <p className="text-xs text-white/70 leading-relaxed">{msg.suggestion}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="mr-auto w-12 bg-white/5 border border-white/10 text-white/50 p-3 rounded-2xl rounded-tl-none flex justify-center">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white/[0.02] border-t border-white/10">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about payments, risks..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-50 transition-all"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
