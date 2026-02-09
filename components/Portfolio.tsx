
import React from 'react';
import { Coin } from '../types';

interface PortfolioProps {
  coins: Coin[];
  livePrices: Record<string, number>;
}

const Portfolio: React.FC<PortfolioProps> = ({ coins, livePrices }) => {
  const holdings = coins.slice(0, 5).map((c, i) => {
    const currentPrice = livePrices[c.id] || c.price;
    return {
      ...c,
      price: currentPrice,
      amount: (i + 1) * (1 / (i + 1)) * (c.symbol === 'BTC' ? 0.25 : 5),
      avgPrice: c.price * 0.92,
    };
  });

  const totalValue = holdings.reduce((acc, h) => acc + (h.amount * h.price), 0);
  const totalCost = holdings.reduce((acc, h) => acc + (h.amount * h.avgPrice), 0);
  const profit = totalValue - totalCost;
  const pnlPercent = (profit / totalCost) * 100;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investment Portfolio</h1>
          <p className="text-slate-500 text-sm">Real-time valuation based on live market feeds.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400">History</button>
          <button className="px-5 py-2.5 bg-indigo-600 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/30 transition-all">+ Deposit Assets</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <span className="text-8xl">💰</span>
          </div>
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Total Net Worth</div>
          <div className="text-4xl font-black mb-2 font-mono tabular-nums">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm font-bold flex items-center gap-1 w-fit px-2 py-1 rounded-lg ${profit >= 0 ? 'text-emerald-500 bg-emerald-500/5' : 'text-rose-500 bg-rose-500/5'}`}>
            {profit >= 0 ? '+' : ''}${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({pnlPercent.toFixed(1)}%)
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">24h Performance</div>
          <div className="text-4xl font-black mb-2 text-emerald-500 font-mono">+1.24%</div>
          <div className="text-slate-500 text-xs font-bold uppercase">Beating Market Cap Avg (0.8%)</div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Risk Exposure</div>
          <div className="text-4xl font-black mb-2 text-amber-500">MODERATE</div>
          <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">Pulse Diversification: 8.4 / 10</div>
        </div>
      </div>

      <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/20">
          <h2 className="font-black text-sm uppercase tracking-widest">Active Holdings List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/50 text-[10px] uppercase text-slate-500 font-black tracking-widest border-b border-slate-800">
              <tr>
                <th className="px-6 py-5">Asset</th>
                <th className="px-6 py-5 text-right">Balance</th>
                <th className="px-6 py-5 text-right">Value (USD)</th>
                <th className="px-6 py-5 text-right">Avg Buy Price</th>
                <th className="px-6 py-5 text-right">Profit / Loss</th>
                <th className="px-6 py-5 text-right">Allocation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {holdings.map(h => (
                <tr key={h.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center font-black text-[10px] text-indigo-400 group-hover:text-indigo-300">
                          {h.symbol}
                        </div>
                        <div>
                           <div className="font-bold text-slate-100">{h.name}</div>
                           <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Wallet Account</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-sm">
                    {h.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} <span className="text-xs text-slate-500">{h.symbol}</span>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-sm font-bold text-slate-200 tabular-nums">
                    ${(h.amount * h.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-xs text-slate-500">
                    ${h.avgPrice.toLocaleString()}
                  </td>
                  <td className={`px-6 py-5 text-right font-black text-sm tabular-nums ${h.price >= h.avgPrice ? 'text-emerald-500' : 'text-rose-500'}`}>
                     {h.price >= h.avgPrice ? '▲' : '▼'} ${(h.amount * (h.price - h.avgPrice)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="px-6 py-5 text-right">
                     <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[10px] font-black text-slate-500 font-mono">{((h.amount * h.price) / totalValue * 100).toFixed(1)}%</span>
                        <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: `${(h.amount * h.price) / totalValue * 100}%` }}></div>
                        </div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
