
import React from 'react';
import { View, Notification } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setView: (v: View) => void;
  notifications: Notification[];
  removeNotification: (id: string) => void;
  globalStats?: {
    totalCap: number;
    totalVolume: number;
    btcDominance: number;
    activeCryptos: number;
  };
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeView, 
  setView, 
  notifications, 
  removeNotification,
  globalStats 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'scanner', label: 'Scanner', icon: '🔍' },
    { id: 'signals', label: 'Signals', icon: '⚡' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
  ];

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white">CP</div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              CryptoPulse AI
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-indigo-400">PRO PLAN</span>
              <span className="text-[10px] bg-indigo-600 px-1.5 py-0.5 rounded text-white">ACTIVE</span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">Unlimited scanners, whale alerts & on-chain metrics unlocked.</p>
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors">
              Manage Billing
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <div className="fixed top-20 right-8 z-[60] space-y-3 pointer-events-none w-80">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right-10 flex items-start gap-3 backdrop-blur-xl ${
                n.type === 'alert' 
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-200' 
                  : n.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex-1">
                <div className="text-xs font-bold uppercase mb-0.5 tracking-wider">
                  {n.type === 'alert' ? 'Price Trigger' : 'Notification'}
                </div>
                <div className="text-sm font-medium leading-snug">{n.message}</div>
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4 text-sm overflow-hidden">
             <div className="flex gap-6 whitespace-nowrap">
                <span className="text-slate-500">Global Cap: <span className="text-slate-200 font-mono text-xs">{globalStats ? formatLargeNumber(globalStats.totalCap) : '...'}</span></span>
                <span className="text-slate-500">24h Vol: <span className="text-slate-200 font-mono text-xs">{globalStats ? formatLargeNumber(globalStats.totalVolume) : '...'}</span></span>
                <span className="text-slate-500">BTC Dom: <span className="text-slate-200 font-mono text-xs">{globalStats ? globalStats.btcDominance.toFixed(1) : '...'}%</span></span>
             </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2 text-sm bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-300 uppercase">Live Pulse</span>
            </div>
            <button className="p-2 hover:bg-slate-900 rounded-full text-slate-400"><span>🔔</span></button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold border border-slate-800">
              AD
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
