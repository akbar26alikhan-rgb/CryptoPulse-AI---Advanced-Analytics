
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
export type SignalType = 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
export type UserRole = 'FREE' | 'PREMIUM' | 'ADMIN';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  category: string;
}

export interface Indicators {
  rsi: number;
  ema50: number;
  ema200: number;
  macd: { value: number; signal: number; histogram: number };
  atr: number;
  adx: number;
  bollinger: { upper: number; lower: number; middle: number };
}

export interface CryptoSignal {
  coinId: string;
  type: SignalType;
  score: number;
  timeframe: Timeframe;
  entryPrice: number;
  stopLoss: number;
  targets: number[];
  reasons: string[];
}

export interface ScoringBreakdown {
  trend: number;
  momentum: number;
  volume: number;
  volatility: number;
  sentiment: number;
  futures?: number;
  onchain?: number;
}
