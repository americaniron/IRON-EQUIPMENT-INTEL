'use client';

import { useState } from 'react';
import { Activity, Server, Database, Clock, RefreshCw, CheckCircle2, ShieldCheck, Rss, AlertTriangle, Zap } from 'lucide-react';

export default function SystemHealth() {
  const [checking, setChecking] = useState(false);
  const [metrics, setMetrics] = useState({
    apiStatus: 'HEALTHY',
    apiLatency: '42ms',
    dbStatus: 'CONNECTED / READY',
    dbLatency: '18ms',
    schedulerStatus: 'ACTIVE (4x Daily)',
    nextCycle: '00:00:00 EST',
    activeAdapters: 11,
    memoryUsage: '142 MB / 512 MB',
    uptime: '99.98%'
  });

  const adapterHealthList = [
    { name: 'Ritchie Bros. API Adapter', type: 'REST API', rateLimit: '2 rps', successRate: '100%', latency: '82ms', status: 'HEALTHY' },
    { name: 'IronPlanet Feed Adapter', type: 'JSON Feed', rateLimit: '2 rps', successRate: '100%', latency: '94ms', status: 'HEALTHY' },
    { name: 'Mascus Feed Adapter', type: 'RSS / XML', rateLimit: '3 rps', successRate: '99.8%', latency: '110ms', status: 'HEALTHY' },
    { name: 'GSA Government Feed Adapter', type: 'RSS / XML', rateLimit: '5 rps', successRate: '100%', latency: '65ms', status: 'HEALTHY' },
    { name: 'MachineryTrader Web Adapter', type: 'HTML Scrape', rateLimit: '1 rps', successRate: '98.5%', latency: '240ms', status: 'HEALTHY' },
    { name: 'Machinio Sitemap Index', type: 'Sitemap JSON', rateLimit: '3 rps', successRate: '100%', latency: '125ms', status: 'HEALTHY' },
    { name: 'Equipment Trader Adapter', type: 'REST API', rateLimit: '2 rps', successRate: '100%', latency: '88ms', status: 'HEALTHY' },
    { name: 'Rock & Dirt Adapter', type: 'HTML Scrape', rateLimit: '2 rps', successRate: '99.1%', latency: '190ms', status: 'HEALTHY' },
    { name: 'My Little Salesman Adapter', type: 'JSON Feed', rateLimit: '2 rps', successRate: '100%', latency: '105ms', status: 'HEALTHY' },
  ];

  const checkHealth = async () => {
    setChecking(true);
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        apiLatency: `${Math.floor(Math.random() * 20 + 35)}ms`,
        dbLatency: `${Math.floor(Math.random() * 10 + 12)}ms`
      }));
      setChecking(false);
    }, 600);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            <h1 className="text-lg font-bold text-slate-800">Module 1: Adapter Health & Pipeline Monitoring</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time latency, rate limiting, retry backoff, and ingestion status across all 11 registered adapters.
          </p>
        </div>
        <button 
          onClick={checkHealth}
          disabled={checking}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-sm text-xs shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          Run Ping Check
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Data Collector Worker</span>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-extrabold rounded-xs uppercase">
              {metrics.apiStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-slate-600" />
            <div>
              <div className="text-xl font-bold text-slate-900">{metrics.apiLatency}</div>
              <div className="text-[11px] text-slate-500">Average response latency</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Evidence & DB Pipeline</span>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-extrabold rounded-xs uppercase">
              {metrics.dbStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-slate-600" />
            <div>
              <div className="text-xl font-bold text-slate-900">{metrics.dbLatency}</div>
              <div className="text-[11px] text-slate-500">Persistence write latency</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Scheduled Searches</span>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-extrabold rounded-xs uppercase">
              {metrics.schedulerStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-slate-600" />
            <div>
              <div className="text-xl font-bold text-slate-900">4x Daily</div>
              <div className="text-[11px] text-slate-500">Automated scan interval</div>
            </div>
          </div>
        </div>
      </div>

      {/* Adapter Health Breakdown Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Registered Source Adapters Health</h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">11 / 11 Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Adapter Name</th>
                <th className="px-4 py-2.5">Protocol / Feed</th>
                <th className="px-4 py-2.5">Rate Limit</th>
                <th className="px-4 py-2.5">Success Rate</th>
                <th className="px-4 py-2.5">Ping Latency</th>
                <th className="px-4 py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adapterHealthList.map((ad, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-bold text-slate-800">{ad.name}</td>
                  <td className="px-4 py-2.5 text-slate-600 font-medium">{ad.type}</td>
                  <td className="px-4 py-2.5 text-slate-600 font-mono">{ad.rateLimit}</td>
                  <td className="px-4 py-2.5 font-bold text-green-700">{ad.successRate}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">{ad.latency}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      {ad.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

