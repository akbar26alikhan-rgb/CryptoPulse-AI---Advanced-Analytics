
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MarketScanner from './components/MarketScanner';
import Signals from './components/Signals';
import CoinDetail from './components/CoinDetail';
import Portfolio from './components/Portfolio';
import { MOCK_COINS } from './mockData';

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
  const [simulatedPrices, setSimulatedPrices] = useState<Record<string, number>>(
    Object.fromEntries(MOCK_COINS.map(c => [c.id, c.price]))
  );

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

  // Price Simulation & Alert Checking
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedPrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          // Volatility simulation: +/- 0.1% change
          const change = 1 + (Math.random() * 0.002 - 0.001);
          next[id] = next[id] * change;
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Alert Monitor
  useEffect(() => {
    alerts.forEach(alert => {
      if (!alert.active) return;
      const currentPrice = simulatedPrices[alert.coinId];
      if (!currentPrice) return;

      const triggered = 
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);

      if (triggered) {
        addNotification(`🚨 ALERT: ${alert.symbol} has crossed $${alert.targetPrice.toLocaleString()}!`, 'alert');
        // Deactivate alert after trigger to prevent spam
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, active: false } : a));
      }
    });
  }, [simulatedPrices, alerts]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onCoinSelect={navigateToCoin} />;
      case 'scanner':
        return <MarketScanner onCoinSelect={navigateToCoin} />;
      case 'signals':
        return <Signals onCoinSelect={navigateToCoin} />;
      case 'detail':
        return selectedCoinId ? (
          <CoinDetail 
            coinId={selectedCoinId} 
            currentPrice={simulatedPrices[selectedCoinId]} 
            onAddAlert={addAlert}
            onRemoveAlert={removeAlert}
            activeAlerts={alerts.filter(a => a.coinId === selectedCoinId)}
          />
        ) : <Dashboard onCoinSelect={navigateToCoin} />;
      case 'portfolio':
        return <Portfolio />;
      default:
        return <Dashboard onCoinSelect={navigateToCoin} />;
    }
  };

  return (
    <Layout 
      activeView={activeView} 
      setView={setActiveView} 
      notifications={notifications}
      removeNotification={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
