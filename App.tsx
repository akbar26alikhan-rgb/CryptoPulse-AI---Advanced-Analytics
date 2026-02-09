
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MarketScanner from './components/MarketScanner';
import Signals from './components/Signals';
import CoinDetail from './components/CoinDetail';
import Portfolio from './components/Portfolio';
import { fetchLiveMarketData, fetchGlobalStats } from './services/marketData';
import { Coin } from './types';

export type View = 'dashboard' | 'scanner' | 'signals' | 'portfolio' | 'detail';

export interface PriceAlert {
  id: string;
  coinId: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  active: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'alert';
}

function App() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  
  const ws = useRef<WebSocket | null>(null);

  // Initial Data Fetch
  useEffect(() => {
    async function init() {
      const [marketData, stats] = await Promise.all([
        fetchLiveMarketData(),
        fetchGlobalStats()
      ]);
      setCoins(marketData);
      setGlobalStats(stats);
      setLivePrices(Object.fromEntries(marketData.map(c => [c.id, c.price])));
      setIsLoading(false);
    }
    init();
  }, []);

  // WebSocket Live Updates
  useEffect(() => {
    if (isLoading || coins.length === 0) return;

    ws.current = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        const updates: Record<string, number> = {};
        data.forEach((ticker: any) => {
          const baseSymbol = ticker.s.replace('USDT', '');
          const coin = coins.find(c => c.symbol === baseSymbol);
          if (coin) {
            updates[coin.id] = parseFloat(ticker.c);
          }
        });
        
        if (Object.keys(updates).length > 0) {
          setLivePrices(prev => ({ ...prev, ...updates }));
        }
      }
    };

    ws.current.onerror = (err) => console.error('WebSocket Error:', err);
    ws.current.onclose = () => console.log('WebSocket Closed. Reconnecting...');

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [isLoading, coins]);

  const navigateToCoin = (coinId: string) => {
    setSelectedCoinId(coinId);
    setActiveView('detail');
  };

  const addAlert = (alert: Omit<PriceAlert, 'id' | 'active'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      active: true,
    };
    setAlerts(prev => [...prev, newAlert]);
    addNotification(`Alert set for ${alert.symbol} at $${alert.targetPrice}`, 'success');
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Alert Monitor
  useEffect(() => {
    alerts.forEach(alert => {
      if (!alert.active) return;
      const currentPrice = livePrices[alert.coinId];
      if (!currentPrice) return;

      const triggered = 
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);

      if (triggered) {
        addNotification(`🚨 ALERT: ${alert.symbol} has crossed $${alert.targetPrice.toLocaleString()}!`, 'alert');
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, active: false } : a));
      }
    });
  }, [livePrices, alerts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-indigo-400 font-mono">LIVE</div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white tracking-tight">Initializing Analysis Engine</h2>
          <p className="text-slate-500 text-sm mt-1">Establishing high-fidelity market streams...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard coins={coins} livePrices={livePrices} onCoinSelect={navigateToCoin} />;
      case 'scanner':
        return <MarketScanner coins={coins} livePrices={livePrices} onCoinSelect={navigateToCoin} />;
      case 'signals':
        return <Signals coins={coins} livePrices={livePrices} onCoinSelect={navigateToCoin} />;
      case 'detail':
        return selectedCoinId ? (
          <CoinDetail 
            coinId={selectedCoinId} 
            coins={coins}
            currentPrice={livePrices[selectedCoinId]} 
            onAddAlert={addAlert}
            onRemoveAlert={removeAlert}
            activeAlerts={alerts.filter(a => a.coinId === selectedCoinId)}
          />
        ) : <Dashboard coins={coins} livePrices={livePrices} onCoinSelect={navigateToCoin} />;
      case 'portfolio':
        return <Portfolio coins={coins} livePrices={livePrices} />;
      default:
        return <Dashboard coins={coins} livePrices={livePrices} onCoinSelect={navigateToCoin} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setView={setActiveView} 
      notifications={notifications}
      removeNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      globalStats={globalStats}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
