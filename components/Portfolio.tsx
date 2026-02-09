
import React from 'react';
import { MOCK_COINS } from '../mockData';

const Portfolio: React.FC = () => {
  const holdings = MOCK_COINS.slice(0, 4).map((c, i) => ({
    ...c,
    amount: (i + 1) * 0.45,
    avgPrice: c.price * 0.95,
  }));

  const totalValue = holdings.reduce((acc, h) => acc + (h.amount * h.price), 0);
  const totalCost = holdings.reduce((acc, h) => acc + (h.amount * h.avgPrice), 0);
  const profit = totalValue - totalCost;
  const pnlPercent = (profit / totalCost) * 100;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investment Portfolio</h1>
          <p className="text-slate-500 text-sm">Real-time valuation and risk analysis of your holdings.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm font-bold">History</button>
          <button className="px-5 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold">+ Buy Assets</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Net Worth</div>
          <div className="text-4xl font-black mb-1">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className="text-emerald-500 text-sm font-bold flex items-center gap-1">
            +${profit.toLocaleString()} ({pnlPercent.toFixed(1)}%)
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">24h Performance</div>
          <div className="text-4xl font-black mb-1 text-emerald-500">+1.2%</div>
          <div className="text-slate-500 text-sm">Beating Market Cap Avg (0.8%)</div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Risk Exposure</div>
          <div className="text-4xl font-black mb-1 text-amber-500">Moderate</div>
          <div className="text-slate-500 text-sm">Diversification Score: 7.2/10</div>
        </div>
      </div>

      <section className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-bold">Active Holdings</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 text-xs uppercase text-slate-500 font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4 text-right">Balance</th>
              <th className="px-6 py-4 text-right">Value</th>
              <th className="px-6 py-4 text-right">Avg Buy Price</th>
              <th className="px-6 py-4 text-right">Profit / Loss</th>
              <th className="px-6 py-4 text-right">Allocation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {holdings.map(h => (
              <tr key={h.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-xs">
                        {h.symbol}
                      </div>
                      <div className="font-bold">{h.name}</div>
                   </div>
                </td>
                <td className="px-6 py-5 text-right font-mono text-sm">
                  {h.amount} {h.symbol}
                </td>
                <td className="px-6 py-5 text-right font-mono text-sm font-bold">
                  ${(h.amount * h.price).toLocaleString()}
                </td>
                <td className="px-6 py-5 text-right font-mono text-sm text-slate-400">
                  ${h.avgPrice.toLocaleString()}
                </td>
                <td className={`px-6 py-5 text-right font-bold text-sm ${h.price > h.avgPrice ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {h.price > h.avgPrice ? '+' : ''}${(h.amount * (h.price - h.avgPrice)).toLocaleString()}
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-slate-400">{((h.amount * h.price) / totalValue * 100).toFixed(1)}%</span>
                      <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500" style={{ width: `${(h.amount * h.price) / totalValue * 100}%` }}></div>
                      </div>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Portfolio;
