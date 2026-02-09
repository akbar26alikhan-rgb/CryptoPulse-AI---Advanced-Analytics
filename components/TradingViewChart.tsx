
import React, { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  interval: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ symbol, interval }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (container.current && (window as any).TradingView) {
        // Clear previous widget content to prevent duplication
        container.current.innerHTML = '';
        
        const widgetContainer = document.createElement('div');
        widgetContainer.id = `tv_chart_${symbol}_${interval}_inner`;
        widgetContainer.style.height = '100%';
        widgetContainer.style.width = '100%';
        container.current.appendChild(widgetContainer);

        new (window as any).TradingView.widget({
          "autosize": true,
          "symbol": `BINANCE:${symbol}USDT`,
          "interval": interval,
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "toolbar_bg": "#0f172a",
          "enable_publishing": false,
          "hide_top_toolbar": false,
          "hide_legend": false,
          "save_image": false,
          "container_id": widgetContainer.id,
          "backgroundColor": "#0f172a",
          "gridColor": "rgba(30, 41, 59, 0.2)",
          "studies": [
            "MASimple@tv-basicstudies",
            "RSI@tv-basicstudies",
            "Volume@tv-basicstudies"
          ],
          "disabled_features": ["header_screenshot", "header_symbol_search"],
          "enabled_features": ["study_templates"],
          "overrides": {
            "paneProperties.background": "#0f172a",
            "paneProperties.backgroundType": "solid"
          }
        });
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      if ((window as any).TradingView) {
        initWidget();
      } else {
        script.addEventListener('load', initWidget);
      }
    }

    return () => {
      if (script) {
        script.removeEventListener('load', initWidget);
      }
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol, interval]);

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden h-[600px] flex flex-col shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1">
             <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
             <div className="w-1.5 h-4 bg-indigo-500/60 rounded-full"></div>
             <div className="w-1.5 h-4 bg-indigo-500/30 rounded-full"></div>
          </div>
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Real-Time Market Execution
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 font-mono">
            BINANCE:{symbol}USDT ({interval === 'D' ? '1D' : interval === '60' ? '1H' : interval === '240' ? '4H' : interval + 'm'})
          </span>
        </div>
      </div>
      <div 
        ref={container} 
        className="flex-1 w-full bg-[#0f172a]"
        style={{ minHeight: '500px' }}
      />
    </div>
  );
};

export default TradingViewChart;
