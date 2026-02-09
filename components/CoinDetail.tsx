
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_SIGNALS, getMockIndicators } from '../mockData';
import { getSignalExplanation } from '../services/gemini';
import { Indicators, CryptoSignal, Coin, Timeframe } from '../types';
import { PriceAlert } from '../App';
import TradingViewChart from './TradingViewChart';

interface CoinDetailProps {
  coinId: string;
  coins: Coin[];
  currentPrice?: number;
  onAddAlert: (alert: Omit<PriceAlert, 'id' | 'active'>) => void;
  onRemoveAlert: (id: string) => void;
  activeAlerts: PriceAlert[];
}

const TIMEFRAME_MAP: Record<Timeframe, string> = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '1h': '60',
  '4h': '240',
  '1d': 'D'
};

const AVAILABLE_INDICATORS = [
  { id: 'EMA', label: 'EMA' },
  { id: 'SMA', label: 'SMA' },
  { id: 'RSI', label: 'RSI' },
  { id: 'MACD', label: 'MACD' },
  { id: 'BB', label: 'Bollinger' },
  { id: 'Volume', label: 'Volume' },
];

const CoinDetail: React.FC<CoinDetailProps> = ({ 
  coinId, 
  coins,
  currentPrice: livePrice, 
  onAddAlert, 
  onRemoveAlert,
  activeAlerts 
}) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1h');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['EMA', 'RSI', 'Volume']);
  
  const [alertPrice, setAlertPrice] = useState('');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');

  const coin = useMemo(() => coins.find(c => c.id === coinId), [coins, coinId]);
  
  if (!coin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="font-bold">Asset index not found in current session.</p>
        <p className="text-sm">Please return to the dashboard and re-select.</p>
      </div>
    );
  }

  const displayPrice = livePrice || coin.price || 0;
  
  const signal = useMemo(() => (MOCK_SIGNALS.find(s => s.coinId === coinId) || {
    coinId,
    type: 'NEUTRAL',
    score: 50,
    timeframe: '4h',
    entryPrice: coin.price,
    stopLoss: coin.price * 0.95,
    targets: [coin.price * 1.05, coin.price * 1.10],
    reasons: ['No major catalyst detected']
  }) as CryptoSignal, [coinId, coin]);
  
  const indicators = useMemo(() => getMockIndicators(displayPrice), [displayPrice]);

  const handleAiAsk = async () => {
    setLoadingAi(true);
    try {
      const result = await getSignalExplanation(coin, signal, indicators);
      setExplanation(result);
    } catch (err) {
      setExplanation("Failed to generate AI analysis. Check your connection or API key.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(alertPrice);
    if (isNaN(price)) return;
    onAddAlert({
      coinId: coin.id,
      symbol: coin.symbol,
      targetPrice: price,
      condition: alertCondition,
    });
    setAlertPrice('');
  };

  const toggleIndicator = (id: string) => {
    setSelectedIndicators(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
     setExplanation(null);
  }, [coinId]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-2xl font-black text-indigo-500 border border-slate-800 shadow-xl">
            {coin.symbol}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight">{coin.name}</h1>
              <span className="px-2 py-0.5 bg-slate-900 rounded text-xs font-bold text-slate-500">{coin.symbol}</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-2xl font-mono font-bold text-slate-200 tracking-tighter tabular-nums">
                ${displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-sm font-bold flex items-center gap-1 ${coin.change24h > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {coin.change24h > 0 ? '▲' : '▼'} {Math.abs(coin.change24h || 0)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl text-sm font-bold transition-all">
            Watchlist
          </button>
          <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all">
            Execute Trade
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <TradingViewChart 
              symbol={coin.symbol} 
              interval={TIMEFRAME_MAP[selectedTimeframe]} 
              activeIndicators={selectedIndicators}
            />
            
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
                {(Object.keys(TIMEFRAME_MAP) as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedTimeframe === tf
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {tf.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2 mr-1">Overlays</span>
                {AVAILABLE_INDICATORS.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => toggleIndicator(ind.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                      selectedIndicators.includes(ind.id)
                        ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-transparent'
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="text-8xl font-black">Pulse</span>
            </div>
            
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 relative">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              Technical Pulse Scoring
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
              <div className="flex justify-center relative">
                 <svg className="w-56 h-56 transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      className="text-indigo-500 transition-all duration-1000 ease-out"
                      strokeDasharray={628.31}
                      strokeDashoffset={628.31 - (628.31 * (signal.score || 0) / 100)}
                      strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black tabular-nums">{signal.score || 0}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Aggregate</span>
                 </div>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'Trend Strength', value: 85, color: 'bg-indigo-500' },
                  { label: 'Momentum', value: 65, color: 'bg-indigo-400' },
                  { label: 'Volume Flow', value: 45, color: 'bg-indigo-300' },
                  { label: 'Market Sentiment', value: 72, color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{item.label}</span>
                      <span className="font-mono">{item.value}/100</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/30">
                      <div className={`h-full ${item.color} shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-700">
            <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-800/50 bg-slate-950/20">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <span className="text-xl">✨</span>
                 </div>
                 <div>
                    <h2 className="text-xl font-bold tracking-tight">AI Signal Explanation</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Powered by Gemini 3 Flash</p>
                 </div>
              </div>
              {explanation && !loadingAi && (
                <button 
                  onClick={handleAiAsk}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-[10px] font-bold text-indigo-400 transition-all uppercase tracking-widest"
                >
                  Regenerate
                </button>
              )}
            </div>

            <div className="p-8">
              {!explanation && !loadingAi && (
                <div className="bg-slate-950/40 p-12 rounded-2xl border border-dashed border-slate-800 text-center space-y-5">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-700 text-2xl">🤖</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-slate-200 font-bold">Deep Strategy Analysis</div>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                      Get a human-friendly breakdown of why this setup was identified and the underlying market logic.
                    </p>
                  </div>
                  <button 
                    onClick={handleAiAsk}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                  >
                    Generate Analysis
                  </button>
                </div>
              )}

              {loadingAi && (
                <div className="space-y-6 py-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 animate-pulse"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-800 rounded w-5/6 animate-pulse"></div>
                      <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              {explanation && (
                <div className="bg-slate-950/50 p-7 rounded-2xl border border-slate-800/50 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50 group-hover:bg-indigo-500 transition-colors"></div>
                  <div className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                    {explanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-indigo-400 uppercase mb-4 tracking-widest flex items-center gap-2">
               <span>🔔</span> Price Alerts
            </h3>
            
            <form onSubmit={handleCreateAlert} className="space-y-3 mb-6">
              <div className="flex gap-2">
                <select 
                  value={alertCondition}
                  onChange={(e) => setAlertCondition(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>
                <input 
                  type="number" 
                  step="any"
                  placeholder="Price..."
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500 text-slate-200"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-bold rounded-xl border border-indigo-500/30 transition-all"
              >
                Set Target Alert
              </button>
            </form>

            <div className="space-y-2">
               {activeAlerts.length === 0 ? (
                 <div className="text-[10px] text-slate-600 text-center py-4 border border-dashed border-slate-800 rounded-2xl uppercase tracking-widest font-bold">
                   No active alerts
                 </div>
               ) : (
                 activeAlerts.map(alert => (
                   <div key={alert.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center group">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Price {alert.condition}</div>
                        <div className="text-sm font-bold text-slate-200 tracking-tight tabular-nums">${(alert.targetPrice || 0).toLocaleString()}</div>
                      </div>
                      <button 
                        onClick={() => onRemoveAlert(alert.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-500 transition-colors"
                      >
                        ✕
                      </button>
                   </div>
                 ))
               )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Technical Metrics</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-sm text-slate-400">RSI (14)</span>
                  <span className={`font-mono font-bold ${(indicators.rsi || 0) > 70 ? 'text-rose-500' : (indicators.rsi || 0) < 30 ? 'text-emerald-500' : 'text-slate-200'}`}>
                    {(indicators.rsi || 0).toFixed(2)}
                  </span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-sm text-slate-400">ADX (Strength)</span>
                  <span className="font-mono text-emerald-400 font-bold">{indicators.adx || 0}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-sm text-slate-400">ATR</span>
                  <span className="font-mono text-slate-200">{(indicators.atr || 0).toFixed(4)}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-sm text-slate-400">EMA (50)</span>
                  <span className="font-mono text-slate-200">${(indicators.ema50 || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Active Setup</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Entry</div>
                    <div className="text-xs font-bold font-mono">${(signal.entryPrice || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                 </div>
                 <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/10">
                    <div className="text-[10px] text-rose-500/70 font-bold uppercase mb-1">Stop</div>
                    <div className="text-xs font-bold text-rose-500 font-mono">${(signal.stopLoss || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                 </div>
              </div>
              <div className="space-y-2">
                 {(signal.targets || []).map((t, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-emerald-500/10 flex justify-between items-center hover:bg-emerald-500/5 transition-colors">
                       <span className="text-[10px] font-bold text-emerald-500/60 uppercase">Target {i+1}</span>
                       <span className="text-xs font-bold text-emerald-500 font-mono">${(t || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
