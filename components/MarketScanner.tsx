
import React, { useState, useMemo } from 'react';
import { Coin } from '../types';

interface MarketScannerProps {
  coins: Coin[];
  livePrices: Record<string, number>;
  onCoinSelect: (id: string) => void;
}

const MarketScanner: React.FC<MarketScannerProps> = ({ coins, livePrices, onCoinSelect }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const scanners = [
    { id: 'all', label: 'All Coins' },
    { id: 'breakouts', label: 'Top Gainers' },
    { id: 'oversold', label: 'Oversold (RSI)' },
    { id: 'volume', label: 'Volume High' },
    { id: 'trend', label: 'Trend Leaders' },
  ];

  const processedCoins = useMemo(() => {
    let result = [...coins];

    // Apply Tab Filtering
    switch (filter) {
      case 'breakouts':
        result = result.filter(c => c.change24h > 5); // 5%+ gainers
        break;
      case 'oversold':
        // Simulated RSI for demo purposes using a stable hash of the ID
        result = result.filter((_, i) => (30 + (i * 7) % 50) < 40);
        break;
      case 'volume':
        const avgVol = result.reduce((acc, c) => acc + c.volume24h, 0) / result.length;
        result = result.filter(c => c.volume24h > avgVol);
        break;
      case 'trend':
        result = result.filter(c => c.change24h > 0);
        break;
      default:
        break;
    }

    // Apply Search Filtering
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.symbol.toLowerCase().includes(query)
      );
    }

    return result;
  }, [coins, filter, search]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Market Scanner</h1>
          <p className="text-slate-500 text-sm">Real-time technical indexing across live market data.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search symbol..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/30 w-full md:w-64 transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {scanners.map(s => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border uppercase tracking-wider ${
              filter === s.id 
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {processedCoins.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Rank #</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Asset</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Live Price</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">24h Delta</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">RSI (Sim)</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Market Cap</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {processedCoins.map((coin, i) => {
                  const rsi = 30 + (i * 7) % 50;
                  const isBullish = coin.change24h > 0;
                  const currentPrice = livePrices[coin.id] || coin.price || 0;

                  return (
                    <tr key={coin.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-5 font-mono text-xs text-slate-600">{(i + 1).toString().padStart(2, '0')}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center font-black text-xs text-indigo-400 border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                            {coin.symbol}
                          </div>
                          <div>
                            <div className="font-bold text-slate-200 text-sm whitespace-nowrap">{coin.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase font-medium tracking-tight">Verified Feed</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-sm text-slate-300 tabular-nums">
                        ${currentPrice > 1 ? currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) : currentPrice.toFixed(6)}
                      </td>
                      <td className={`px-6 py-5 text-right font-bold text-sm ${isBullish ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <span className={`text-[10px] font-mono font-bold ${rsi > 70 ? 'text-rose-500' : rsi < 30 ? 'text-emerald-500' : 'text-slate-400'}`}>
                             {rsi.toFixed(1)}
                           </span>
                           <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full bg-indigo-500`} style={{ width: `${rsi}%` }}></div>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right text-xs font-mono text-slate-500 uppercase">
                        ${(coin.marketCap / 1e9).toFixed(2)}B
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button 
                          onClick={() => onCoinSelect(coin.id)}
                          className="px-4 py-2 bg-slate-800 hover:bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                        >
                          Scan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl text-slate-500 mb-2">
                 🔎
               </div>
               <div>
                 <h3 className="text-lg font-bold text-slate-200">No assets matching criteria</h3>
                 <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search query to see more results.</p>
               </div>
               <button 
                 onClick={() => { setFilter('all'); setSearch(''); }}
                 className="px-6 py-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all border border-indigo-500/20"
               >
                 Reset Filters
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketScanner;
