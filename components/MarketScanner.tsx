
import React, { useState } from 'react';
import { MOCK_COINS } from '../mockData';

interface MarketScannerProps {
  onCoinSelect: (id: string) => void;
}

const MarketScanner: React.FC<MarketScannerProps> = ({ onCoinSelect }) => {
  const [filter, setFilter] = useState('all');

  const scanners = [
    { id: 'all', label: 'All Coins' },
    { id: 'breakouts', label: 'Price Breakouts' },
    { id: 'oversold', label: 'RSI Oversold' },
    { id: 'volume', label: 'High Volume Spike' },
    { id: 'trend', label: 'Trend Strength' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Market Scanner</h1>
          <p className="text-slate-500 text-sm">Scan across 2,000+ assets using real-time technical filters.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/50 w-64"
            />
            <span className="absolute left-3 top-2.5 text-slate-500">🔍</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {scanners.map(s => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
              filter === s.id 
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-slate-800">
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Asset</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Technical State</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Last Price</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">RSI (14)</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">EMA 50/200</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Pulse Score</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_COINS.map((coin, i) => {
              const rsi = 30 + (i * 7) % 50;
              const isBullish = rsi > 50 && i % 2 === 0;
              const score = 40 + (i * 12) % 60;

              return (
                <tr key={coin.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-xs text-indigo-400 border border-slate-700">
                        {coin.symbol}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">{coin.name}</div>
                        <div className="text-xs text-slate-500 uppercase">{coin.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${isBullish ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {isBullish ? 'Bullish' : 'Neutral'}
                      </span>
                      {i % 3 === 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold bg-indigo-500/10 text-indigo-400">
                          Breakout
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-sm text-slate-300">
                    ${coin.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <span className={`text-sm font-bold ${rsi > 70 ? 'text-rose-500' : rsi < 30 ? 'text-emerald-500' : 'text-slate-400'}`}>
                         {rsi}
                       </span>
                       <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full bg-indigo-500`} style={{ width: `${rsi}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                     <span className={`text-xs font-medium ${isBullish ? 'text-emerald-400' : 'text-slate-500'}`}>
                       {isBullish ? 'Golden Cross' : 'Trading Range'}
                     </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`text-sm font-bold ${score > 70 ? 'text-indigo-400' : 'text-slate-400'}`}>{score}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => onCoinSelect(coin.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketScanner;
