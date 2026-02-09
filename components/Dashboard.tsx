
import React from 'react';
import { MOCK_COINS, MOCK_SIGNALS } from '../mockData';

interface DashboardProps {
  onCoinSelect: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCoinSelect }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 text-sm font-medium">Portfolio Balance</div>
            <span className="text-indigo-400 group-hover:scale-110 transition-transform">📈</span>
          </div>
          <div className="text-3xl font-bold tracking-tight mb-1">$42,850.12</div>
          <div className="text-emerald-500 text-sm font-medium flex items-center gap-1">
            +$1,420.24 (3.4%) <span className="text-xs text-slate-500">24h</span>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 text-sm font-medium">Active Signals</div>
            <span className="text-amber-400">⚡</span>
          </div>
          <div className="text-3xl font-bold tracking-tight mb-1">14</div>
          <div className="text-slate-500 text-sm">8 Buy | 4 Neutral | 2 Sell</div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 text-sm font-medium">Market Sentiment</div>
            <span className="text-rose-400">🔥</span>
          </div>
          <div className="text-3xl font-bold tracking-tight mb-1">64 / 100</div>
          <div className="text-indigo-400 text-sm font-medium">Greed Zone</div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div className="text-slate-400 text-sm font-medium">Daily ROI</div>
            <span className="text-emerald-400">💰</span>
          </div>
          <div className="text-3xl font-bold tracking-tight mb-1">+2.8%</div>
          <div className="text-slate-500 text-sm">Outperforming BTC (1.1%)</div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Movers */}
        <section className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold">Top Market Movers</h2>
            <button className="text-xs text-indigo-400 hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-slate-500 bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">Asset</th>
                  <th className="px-6 py-4 font-semibold text-right">Price</th>
                  <th className="px-6 py-4 font-semibold text-right">24h Change</th>
                  <th className="px-6 py-4 font-semibold text-right">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_COINS.map(coin => (
                  <tr 
                    key={coin.id} 
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    onClick={() => onCoinSelect(coin.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
                          {coin.symbol[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200">{coin.symbol}</div>
                          <div className="text-xs text-slate-500">{coin.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${coin.change24h > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                    </td>
                    <td className="px-6 py-4 text-right text-slate-400 text-sm">
                      ${(coin.marketCap / 1e9).toFixed(2)}B
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Hot Signals */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-lg font-bold">Hot Trading Signals</h2>
          </div>
          <div className="p-4 space-y-4">
            {MOCK_SIGNALS.map(signal => {
              const coin = MOCK_COINS.find(c => c.id === signal.coinId);
              return (
                <div key={signal.coinId} className="bg-slate-950 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-indigo-400">{coin?.symbol}</span>
                       <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 uppercase">{signal.timeframe}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      signal.type.includes('BUY') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {signal.type}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-slate-500">Pulse Score</div>
                      <div className="text-2xl font-bold text-slate-200">{signal.score}<span className="text-xs text-slate-600">/100</span></div>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-colors">
                      ANALYSIS
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
