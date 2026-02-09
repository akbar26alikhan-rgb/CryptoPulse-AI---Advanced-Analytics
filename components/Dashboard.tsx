
import React from 'react';
import { Coin } from '../types';
import { MOCK_SIGNALS } from '../mockData';

interface DashboardProps {
  coins: Coin[];
  livePrices: Record<string, number>;
  onCoinSelect: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ coins, livePrices, onCoinSelect }) => {
  const topGainers = [...coins].sort((a, b) => b.change24h - a.change24h).slice(0, 8);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 text-sm font-medium">Portfolio Balance</div>
            <span className="text-indigo-400 group-hover:scale-110 transition-transform">📈</span>
          </div>
          <div className="text-3xl font-bold tracking-tight mb-1 font-mono">
            ${(42850.12 + (Math.random() * 10)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="text-emerald-500 text-sm font-medium flex items-center gap-1">
            +$1,420.24 (3.4%) <span className="text-xs text-slate-500">24h</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 text-sm font-medium">Market Pulse</div>
            <span className="text-amber-400">⚡</span>
          </div>
          <div className="text-3xl font-bold tracking-tight mb-1 font-mono">14</div>
          <div className="text-slate-500 text-sm">Active signals across 50 assets</div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 text-sm font-medium">Sentiment Index</div>
            <span className="text-rose-400">🔥</span>
          </div>
          <div className="text-3xl font-bold tracking-tight mb-1 font-mono">68</div>
          <div className="text-indigo-400 text-sm font-medium uppercase text-xs font-bold">Greed Momentum</div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 text-sm font-medium">Avg Market Change</div>
            <span className="text-emerald-400">💰</span>
          </div>
          <div className="text-3xl font-bold tracking-tight mb-1 font-mono">
            {([...coins].reduce((acc, c) => acc + c.change24h, 0) / coins.length).toFixed(1)}%
          </div>
          <div className="text-slate-500 text-sm">Past 24 hours trend</div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Movers */}
        <section className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold">Top Market Performers</h2>
            <button className="text-xs text-indigo-400 font-bold uppercase tracking-wider hover:underline">Full Scanner</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase text-slate-500 font-bold tracking-widest bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4 text-right">Live Price (USD)</th>
                  <th className="px-6 py-4 text-right">24h Delta</th>
                  <th className="px-6 py-4 text-right">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topGainers.map(coin => {
                  const currentPrice = livePrices[coin.id] || coin.price;
                  return (
                    <tr 
                      key={coin.id} 
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                      onClick={() => onCoinSelect(coin.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center font-black text-[10px] text-indigo-500 border border-slate-800">
                            {coin.symbol}
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 text-sm">{coin.symbol}</div>
                            <div className="text-[10px] text-slate-500 font-medium uppercase">{coin.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-sm">
                        <span className="tabular-nums transition-all duration-300">
                          ${currentPrice > 1 ? currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : currentPrice.toFixed(6)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold text-sm ${coin.change24h > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500 text-xs font-mono uppercase">
                        ${(coin.marketCap / 1e9).toFixed(2)}B
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Hot Signals */}
        <section className="bg-slate-900 rounded-3xl border border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-bold">Emerging Signal Setups</h2>
          </div>
          <div className="p-4 space-y-4">
            {MOCK_SIGNALS.map(signal => {
              const coin = coins.find(c => c.id === signal.coinId) || coins[0];
              return (
                <div key={signal.coinId} className="bg-slate-950 rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <span className="font-black text-indigo-400 text-sm">{coin?.symbol}</span>
                       <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-500 font-bold uppercase tracking-widest">{signal.timeframe}</span>
                    </div>
                    <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full uppercase ${
                      signal.type.includes('BUY') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {signal.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase mb-0.5">Pulse Score</div>
                      <div className="text-2xl font-black text-slate-200">{signal.score}<span className="text-xs text-slate-600 font-normal">/100</span></div>
                    </div>
                    <button 
                      onClick={() => onCoinSelect(coin.id)}
                      className="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-xl text-[10px] font-black transition-all border border-indigo-500/20"
                    >
                      EXECUTE
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
