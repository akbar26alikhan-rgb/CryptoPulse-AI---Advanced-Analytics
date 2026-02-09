
import React, { useState, useEffect } from 'react';
import { MOCK_COINS, MOCK_SIGNALS, getMockIndicators } from '../mockData';
import { getSignalExplanation } from '../services/gemini';
import { Indicators, CryptoSignal, Coin, Timeframe } from '../types';
import { PriceAlert } from '../App';
import TradingViewChart from './TradingViewChart';

interface CoinDetailProps {
  coinId: string;
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

const CoinDetail: React.FC<CoinDetailProps> = ({ 
  coinId, 
  currentPrice: livePrice, 
  onAddAlert, 
  onRemoveAlert,
  activeAlerts 
}) => {
  const [loadingAi, setLoadingAi] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1h');
  
  // Alert Form State
  const [alertPrice, setAlertPrice] = useState('');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');

  const coin = MOCK_COINS.find(c => c.id === coinId) as Coin;
  const displayPrice = livePrice || coin.price;
  
  const signal = (MOCK_SIGNALS.find(s => s.coinId === coinId) || {
    coinId,
    type: 'NEUTRAL',
    score: 50,
    timeframe: '4h',
    entryPrice: coin.price,
    stopLoss: coin.price * 0.95,
    targets: [coin.price * 1.05, coin.price * 1.10],
    reasons: ['No major catalyst detected']
  }) as CryptoSignal;
  
  const indicators = getMockIndicators(coin.symbol) as Indicators;

  const handleAiAsk = async () => {
    setLoadingAi(true);
    const result = await getSignalExplanation(coin, signal, indicators);
    setExplanation(result);
    setLoadingAi(false);
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

  useEffect(() => {
     setExplanation(null);
  }, [coinId]);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Info */}
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
              <span className="text-2xl font-mono font-bold text-slate-200 tracking-tighter">
                ${displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-sm font-bold ${coin.change24h > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {coin.change24h > 0 ? '▲' : '▼'} {Math.abs(coin.change24h)}%
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
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* TradingView Chart Container */}
          <div className="space-y-4">
            <TradingViewChart symbol={coin.symbol} interval={TIMEFRAME_MAP[selectedTimeframe]} />
            
            {/* Timeframe Selector */}
            <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
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
          </div>

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
              Pulse Scoring Breakdown
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center relative">
                 <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      className="text-indigo-500 transition-all duration-1000"
                      strokeDasharray={552.92}
                      strokeDashoffset={552.92 - (552.92 * signal.score / 100)}
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black">{signal.score}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aggregate Score</span>
                 </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Trend Strength', value: 85, color: 'bg-indigo-500' },
                  { label: 'Momentum', value: 65, color: 'bg-purple-500' },
                  { label: 'Volume Flow', value: 45, color: 'bg-blue-500' },
                  { label: 'Market Sentiment', value: 72, color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>{item.label}</span>
                      <span>{item.value}/100</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Explanation Section */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
            <div className="p-8 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">✨</div>
                 <h2 className="text-xl font-bold">AI Signal Analysis</h2>
              </div>
              {!explanation && !loadingAi && (
                <button 
                  onClick={handleAiAsk}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Regenerate Analysis
                </button>
              )}
            </div>

            <div className="p-8 pt-6">
              {!explanation && !loadingAi && (
                <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center space-y-4">
                  <div className="text-slate-400 text-sm">Need a human-friendly breakdown of why this signal was generated?</div>
                  <button 
                    onClick={handleAiAsk}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-sm font-bold shadow-lg transition-all"
                  >
                    Generate AI Insights
                  </button>
                </div>
              )}

              {loadingAi && (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                  <div className="text-xs text-indigo-400 font-bold mt-4">Consulting Gemini Pulse AI Engine...</div>
                </div>
              )}

              {explanation && (
                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed bg-slate-950/50 p-6 rounded-2xl border border-slate-800 whitespace-pre-wrap">
                  {explanation}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Metrics */}
        <div className="space-y-6">
          {/* Price Alerts Card */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
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
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-bold rounded-xl border border-indigo-500/30 transition-all"
              >
                Set Target Alert
              </button>
            </form>

            <div className="space-y-2">
               {activeAlerts.length === 0 ? (
                 <div className="text-[10px] text-slate-600 text-center py-4 border border-dashed border-slate-800 rounded-2xl uppercase tracking-widest">
                   No active alerts
                 </div>
               ) : (
                 activeAlerts.map(alert => (
                   <div key={alert.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex justify-between items-center group">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-0.5">Price {alert.condition}</div>
                        <div className="text-sm font-bold text-slate-200 tracking-tight">${alert.targetPrice.toLocaleString()}</div>
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

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Technical Metrics</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-sm text-slate-400">RSI (14)</span>
                  <span className="font-mono text-slate-200">{indicators.rsi.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-sm text-slate-400">ADX (Strength)</span>
                  <span className="font-mono text-emerald-400">{indicators.adx}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-sm text-slate-400">ATR</span>
                  <span className="font-mono text-slate-200">{indicators.atr.toFixed(4)}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-sm text-slate-400">EMA (50)</span>
                  <span className="font-mono text-slate-200">${indicators.ema50.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-400">MACD Hist.</span>
                  <span className="font-mono text-emerald-400">+{indicators.macd.histogram}</span>
               </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-3xl border border-indigo-500/20 p-6">
            <h3 className="text-sm font-bold text-indigo-400 uppercase mb-4 tracking-widest">Risk Management</h3>
            <div className="space-y-4">
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Risk/Reward</div>
                  <div className="text-lg font-bold">1 : 2.45</div>
               </div>
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-rose-500/20">
                  <div className="text-[10px] text-rose-500/60 font-bold uppercase mb-1">Max Drawdown Target</div>
                  <div className="text-lg font-bold text-rose-500">2.4%</div>
               </div>
               <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Liquidity Depth</div>
                  <div className="text-lg font-bold">Deep ($42M @ 2%)</div>
               </div>
            </div>
          </div>

          {/* New Signals Section in Sidebar */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Active Setup</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                 <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Entry</div>
                    <div className="text-sm font-bold">${signal.entryPrice.toLocaleString()}</div>
                 </div>
                 <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/10">
                    <div className="text-[10px] text-rose-500/70 font-bold uppercase mb-1">Stop</div>
                    <div className="text-sm font-bold text-rose-500">${signal.stopLoss.toLocaleString()}</div>
                 </div>
              </div>
              <div className="space-y-2">
                 {signal.targets.map((t, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-emerald-500/10 flex justify-between items-center">
                       <span className="text-[10px] font-bold text-emerald-500/60 uppercase">Target {i+1}</span>
                       <span className="text-sm font-bold text-emerald-500">${t.toLocaleString()}</span>
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
