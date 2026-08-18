'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { Bell, TrendingDown, Sparkles, Clock } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadAlerts() {
      try {
        const snap = await getDocs(query(collection(db, 'alerts'), limit(20)));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!isMounted) return;
        if (docs.length === 0) {
          setAlerts([
            {
              id: 'alt-1',
              type: 'PRICE_DROP',
              title: 'Significant Price Drop: 2020 CAT 336 Excavator',
              description: 'Price reduced by $15,000 (from $195,000 to $180,000) on MachineryTrader.',
              timestamp: '25 mins ago',
              read: false,
              priority: 'HIGH'
            },
            {
              id: 'alt-2',
              type: 'NEW_MATCH',
              title: 'New High Priority Match: John Deere 850L Dozer',
              description: 'Direct dealer listing discovered in Texas matching target model filter.',
              timestamp: '2 hours ago',
              read: false,
              priority: 'MEDIUM'
            },
            {
              id: 'alt-3',
              type: 'INTEGRITY_ALERT',
              title: 'Suspicious Pricing Outlier Detected',
              description: 'Komatsu PC200-8 listed for $14,000 on regional classified.',
              timestamp: '5 hours ago',
              read: true,
              priority: 'HIGH'
            }
          ]);
        } else {
          setAlerts(docs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAlerts();
    return () => { isMounted = false; };
  }, []);

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            <h1 className="text-lg font-bold text-slate-800">Acquisition Alerts & Notifications</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant triggers for price drops, freshly scraped target models, and seller updates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={markAllRead}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-sm text-xs font-bold shadow-xs"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="bg-white border border-slate-200 p-8 text-center text-slate-500 rounded-sm">
            Loading notifications...
          </div>
        ) : alerts.map(alert => (
          <div 
            key={alert.id} 
            className={`p-4 rounded-sm border transition-colors ${
              alert.read 
                ? 'bg-white border-slate-200 text-slate-700' 
                : 'bg-orange-50/20 border-orange-200/80 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xs shrink-0 ${
                  alert.type === 'PRICE_DROP' ? 'bg-emerald-100 text-emerald-700' :
                  alert.type === 'NEW_MATCH' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {alert.type === 'PRICE_DROP' ? <TrendingDown className="w-4 h-4" /> :
                   alert.type === 'NEW_MATCH' ? <Sparkles className="w-4 h-4" /> :
                   <Bell className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B]">{alert.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{alert.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {alert.timestamp}</span>
                    <span>•</span>
                    <span className="uppercase">{alert.type?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-xs text-[9px] font-extrabold uppercase tracking-wider ${
                alert.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {alert.priority || 'NORMAL'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
