
import React from 'react';
import { MOCK_COINS, MOCK_SIGNALS } from '../mockData';

interface SignalsProps {
  onCoinSelect: (id: string) => void;
}

const Signals: React.FC<SignalsProps> = ({ onCoinSelect }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trading Signals</h1>
          <p className="text-slate-500 text-sm">High-confidence setups identified by our scoring engine.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-sm font-medium">
            Filters
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20">
            Export Signals
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_SIGNALS.map(signal => {
          const coin = MOCK_COINS.find(c => c.id === signal.coinId);
          if (!coin) return null;

          return (
            <div 
              key={signal.coinId} 
              className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col group shadow-xl"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-br from-slate-900 to-slate-950">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-indigo-400">
                    {coin.symbol}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100">{coin.name}</h3>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{signal.timeframe} SIGNAL</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                  signal.type.includes('BUY') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                }`}>
                  {signal.type}
                </div>
              </div>

              <div className="p-6 flex-1 space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Confidence Score</span>
                    <div className="text-4xl font-black text-white group-hover:text-indigo-400 transition-colors">
                      {signal.score}<span className="text-lg text-slate-700">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Current Price</span>
                    <div className="text-xl font-mono font-bold text-slate-200">
                      ${coin.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Entry Range</div>
                    <div className="text-sm font-bold text-slate-200">${signal.entryPrice.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-rose-500/10">
                    <div className="text-[10px] font-bold text-rose-500/70 uppercase mb-1">Stop Loss</div>
                    <div className="text-sm font-bold text-rose-500">${signal.stopLoss.toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Take Profit Targets</div>
                  <div className="flex gap-2">
                    {signal.targets.map((t, idx) => (
                      <div key={idx} className="flex-1 p-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-center">
                        <div className="text-[10px] font-medium text-emerald-500/60">TP{idx+1}</div>
                        <div className="text-xs font-bold text-emerald-500">${t.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Primary Drivers</div>
                  <div className="flex flex-wrap gap-2">
                    {signal.reasons.map((r, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 px-2 py-1 rounded-md text-slate-400 border border-slate-700/50">
                        • {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/50 border-t border-slate-800">
                <button 
                  onClick={() => onCoinSelect(signal.coinId)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 group"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
                  AI ANALYSIS & CHART
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
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
