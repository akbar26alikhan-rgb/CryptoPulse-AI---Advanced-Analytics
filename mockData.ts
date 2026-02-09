
import { Coin, CryptoSignal, Indicators } from './types';

export const MOCK_COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 68420.50, change24h: 2.45, volume24h: 35000000000, marketCap: 1350000000000, category: 'Layer 1' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2642.12, change24h: -1.12, volume24h: 15000000000, marketCap: 310000000000, category: 'Layer 1' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 145.88, change24h: 5.67, volume24h: 4200000000, marketCap: 68000000000, category: 'Layer 1' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.354, change24h: 0.23, volume24h: 350000000, marketCap: 12500000000, category: 'Layer 1' },
  { id: 'ripple', symbol: 'XRP', name: 'Ripple', price: 0.542, change24h: -0.45, volume24h: 1200000000, marketCap: 30000000000, category: 'Payment' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 4.12, change24h: 1.55, volume24h: 180000000, marketCap: 6000000000, category: 'Layer 0' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', price: 11.23, change24h: 3.21, volume24h: 450000000, marketCap: 7000000000, category: 'Oracle' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.124, change24h: 8.92, volume24h: 2100000000, marketCap: 18000000000, category: 'Meme' },
];

export const getMockIndicators = (symbol: string): Indicators => ({
  rsi: Math.floor(Math.random() * 60) + 20,
  ema50: MOCK_COINS.find(c => c.symbol === symbol)?.price! * 0.98,
  ema200: MOCK_COINS.find(c => c.symbol === symbol)?.price! * 0.95,
  macd: { value: 0.5, signal: 0.3, histogram: 0.2 },
  atr: MOCK_COINS.find(c => c.symbol === symbol)?.price! * 0.02,
  adx: 28,
  bollinger: { 
    upper: MOCK_COINS.find(c => c.symbol === symbol)?.price! * 1.05, 
    lower: MOCK_COINS.find(c => c.symbol === symbol)?.price! * 0.95, 
    middle: MOCK_COINS.find(c => c.symbol === symbol)?.price! 
  },
});

export const MOCK_SIGNALS: CryptoSignal[] = [
  {
    coinId: 'bitcoin',
    type: 'STRONG BUY',
    score: 88,
    timeframe: '4h',
    entryPrice: 68400,
    stopLoss: 66800,
    targets: [70500, 72000],
    reasons: ['EMA Bullish Cross', 'RSI Neutral Rising', 'Volume Spike 1.5x']
  },
  {
    coinId: 'solana',
    type: 'BUY',
    score: 72,
    timeframe: '1h',
    entryPrice: 145.5,
    stopLoss: 141.2,
    targets: [152, 158],
    reasons: ['Supertrend Buy Zone', 'ADX Strength > 25']
  },
  {
    coinId: 'ethereum',
    type: 'NEUTRAL',
    score: 52,
    timeframe: '4h',
    entryPrice: 2640,
    stopLoss: 2580,
    targets: [2720, 2800],
    reasons: ['RSI Overbought Pullback', 'Support Level Holding']
  }
];
