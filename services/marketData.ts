
import { Coin } from '../types';

const COINGECKO_URL = 'https://api.coingecko.com/api/v3';
const COINCAP_URL = 'https://api.coincap.io/v2';

export async function fetchLiveMarketData(): Promise<Coin[]> {
  try {
    // Attempt CoinGecko first (better metadata)
    const response = await fetch(
      `${COINGECKO_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false`
    );
    
    if (!response.ok) throw new Error('CoinGecko rate limit or error');
    
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      symbol: item.symbol.toUpperCase(),
      name: item.name,
      price: item.current_price,
      change24h: item.price_change_percentage_24h,
      volume24h: item.total_volume,
      marketCap: item.market_cap,
      category: 'Top Assets'
    }));
  } catch (error) {
    console.warn('Falling back to CoinCap API...', error);
    try {
      const response = await fetch(`${COINCAP_URL}/assets?limit=50`);
      const data = await response.json();
      return data.data.map((item: any) => ({
        id: item.id,
        symbol: item.symbol,
        name: item.name,
        price: parseFloat(item.priceUsd),
        change24h: parseFloat(item.changePercent24Hr),
        volume24h: parseFloat(item.volumeUsd24Hr),
        marketCap: parseFloat(item.marketCapUsd),
        category: 'Market Assets'
      }));
    } catch (fallbackError) {
      console.error('All market data sources failed', fallbackError);
      return [];
    }
  }
}

export async function fetchGlobalStats() {
  try {
    const response = await fetch(`${COINGECKO_URL}/global`);
    const data = await response.json();
    const stats = data.data;
    return {
      totalCap: stats.total_market_cap.usd,
      totalVolume: stats.total_volume.usd,
      btcDominance: stats.market_cap_percentage.btc,
      activeCryptos: stats.active_cryptocurrencies
    };
  } catch (e) {
    return {
      totalCap: 2450000000000,
      totalVolume: 84200000000,
      btcDominance: 54.2,
      activeCryptos: 12000
    };
  }
}
