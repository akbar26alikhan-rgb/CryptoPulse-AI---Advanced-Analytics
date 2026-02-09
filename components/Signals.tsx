
import React, { useState } from 'react';
import { MOCK_SIGNALS, getMockIndicators } from '../mockData';
import { CryptoSignal, Coin } from '../types';

interface SignalsProps {
  coins: Coin[];
  livePrices: Record<string, number>;
  onCoinSelect: (id: string) => void;
}

const Signals: React.FC<SignalsProps> = ({ coins, livePrices, onCoinSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSignals, setActiveSignals] = useState<CryptoSignal[]>(MOCK_SIGNALS);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManualCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = searchQuery.toUpperCase().trim();
    if (!symbol) return;

    setIsSearching(true);
    setError(null);

    // Simulate network/calculation delay for "Live Scanning" effect
    setTimeout(() => {
      const coin = coins.find(c => c.symbol === symbol || c.name.toUpperCase() === symbol);
      
      if (!coin) {
        setError(`Asset "${symbol}" not indexed in our current market pulse.`);
        setIsSearching(false);
        return;
      }

      const existingSignal = activeSignals.find(s => s.coinId === coin.id);
      if (existingSignal) {
        setSearchQuery('');
        setIsSearching(false);
        return;
      }

      const score = 45 + Math.floor(Math.random() * 45);
      const type = score > 80 ? 'STRONG BUY' : score > 65 ? 'BUY' : score < 40 ? 'SELL' : 'NEUTRAL';
      
      const newSignal: CryptoSignal = {
        coinId: coin.id,
        type: type,
        score: score,
        timeframe: '1h',
        entryPrice: livePrices[coin.id] || coin.price,
        stopLoss: (livePrices[coin.id] || coin.price) * 0.975,
        targets: [(livePrices[coin.id] || coin.price) * 1.04, (livePrices[coin.id] || coin.price) * 1.09],
        reasons: ['Live Scan Match', 'RSI Divergence Check', 'High Vol Cluster']
      };

      setActiveSignals([newSignal, ...activeSignals]);
      setSearchQuery('');
      setIsSearching(false);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Signal Generation</h1>
          <p className="text-slate-500 text-sm">Automated setups derived from multi-timeframe volume and volatility scans.</p>
        </div>
        
        <div className="w-full md:w-auto">
          <form onSubmit={handleManualCheck} className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Lookup Symbol (e.g. ADA)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
              />
              {isSearching && (
                <div className="absolute right-4 top-3">
                   <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              SCAN
            </button>
          </form>
          {error && <p className="text-[10px] text-rose-500 font-black mt-2 ml-4 uppercase tracking-widest animate-bounce">{error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {activeSignals.map(signal => {
          const coin = coins.find(c => c.id === signal.coinId);
          if (!coin) return null;
          const currentPrice = livePrices[coin.id] || coin.price;

          return (
            <div 
              key={signal.coinId} 
              className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col group shadow-2xl animate-in zoom-in-95 duration-500"
            >
              <div className="p-8 pb-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center font-black text-indigo-400 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                    {coin.symbol}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-100 uppercase tracking-tight">{coin.name}</h3>
                    <div className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">{signal.timeframe} STRATEGY</div>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                  signal.type.includes('BUY') 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                    : signal.type.includes('SELL') 
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {signal.type}
                </div>
              </div>

              <div className="p-8 flex-1 space-y-8">
                <div className="flex justify-between items-end bg-slate-950/30 p-4 rounded-3xl border border-slate-800/50 shadow-inner">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence Score</span>
                    <div className="text-5xl font-black text-white group-hover:text-indigo-400 transition-colors font-mono">
                      {signal.score}<span className="text-lg text-slate-800 font-normal">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Price</span>
                    <div className="text-xl font-mono font-bold text-slate-200 tabular-nums">
                      ${currentPrice > 1 ? currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) : currentPrice.toFixed(6)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-[2rem] border border-slate-800 shadow-inner">
                    <div className="text-[10px] font-black text-slate-600 uppercase mb-1.5 tracking-widest">Entry Zone</div>
                    <div className="text-sm font-black text-slate-200 font-mono">${signal.entryPrice.toLocaleString()}</div>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-[2rem] border border-rose-500/10 shadow-inner">
                    <div className="text-[10px] font-black text-rose-500/50 uppercase mb-1.5 tracking-widest">Hard Stop</div>
                    <div className="text-sm font-black text-rose-500 font-mono">${signal.stopLoss.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-black text-slate-600 uppercase mb-3 tracking-widest px-1">Profit Targets</div>
                  <div className="flex gap-3">
                    {signal.targets.map((t, idx) => (
                      <div key={idx} className="flex-1 p-3 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-center shadow-inner">
                        <div className="text-[9px] font-black text-emerald-500/40 uppercase tracking-tighter">TP {idx+1}</div>
                        <div className="text-xs font-black text-emerald-500 font-mono">${t.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-950 border-t border-slate-800">
                <button 
                  onClick={() => onCoinSelect(signal.coinId)}
                  className="w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border border-indigo-500/20 group/btn"
                >
                  <span className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300">✨</span>
                  Live AI Deep Scan
                  <span className="opacity-0 translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Signals;
