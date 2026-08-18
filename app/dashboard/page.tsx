'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { BarChart3, CheckCircle2, AlertTriangle, Clock, Server } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVerified: 0,
    newToday: 0,
    rejected: 0,
    activeSources: 0,
  });
  
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        let verifiedSize = 0;
        let sourcesSize = 5;
        let recentListings: any[] = [];

        try {
          const res = await fetch('/api/verified-listings');
          if (res.ok) {
            const data = await res.json();
            if (data.listings && Array.isArray(data.listings)) {
              verifiedSize = data.listings.length;
              recentListings = data.listings.slice(0, 8);
            }
          }
        } catch (err) {
          console.warn('API fetch warning:', err);
        }

        if (verifiedSize === 0) {
          try {
            const verifiedSnap = await getDocs(query(collection(db, 'verified_listings'), where('status', '==', 'active')));
            verifiedSize = verifiedSnap.size;
          } catch {}
        }

        setRecent(recentListings);
        setStats({
          totalVerified: verifiedSize,
          newToday: verifiedSize,
          rejected: 14,
          activeSources: sourcesSize
        });
      } catch (e) {
        console.error("Error fetching stats", e);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         <h1 className="text-lg font-bold text-slate-800">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard title="Total Verified Active" value={stats.totalVerified} icon={CheckCircle2} color="text-green-600" bg="bg-green-50" loading={loading} />
         <StatCard title="New Matches Today" value={stats.newToday} icon={BarChart3} color="text-blue-600" bg="bg-blue-50" loading={loading} />
         <StatCard title="Active Sources" value={stats.activeSources} icon={Server} color="text-indigo-600" bg="bg-indigo-50" loading={loading} />
         <StatCard title="Rejected Candidates" value={stats.rejected} icon={AlertTriangle} color="text-amber-600" bg="bg-amber-50" loading={loading} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
         {/* Simple list of recent verified */}
         <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-4">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
               <h2 className="text-sm font-bold text-slate-800">Recently Verified</h2>
               <Link href="/dashboard/matches" className="text-[11px] font-bold text-blue-600 hover:underline uppercase tracking-wider">View all</Link>
            </div>
            {recent.length === 0 ? (
               <div className="text-xs text-slate-500 py-8 text-center bg-slate-50 rounded-sm border border-slate-100">
                  No recent matches found. Start a scan to populate.
               </div>
            ) : (
               <div className="divide-y divide-slate-100">
                  {recent.map(item => (
                     <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div>
                           <div className="font-bold text-slate-800">{item.manufacturer} {item.model}</div>
                           <div className="text-[10px] text-slate-500">{item.sourceId} • {item.location}</div>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-slate-900">${item.price?.toLocaleString()}</div>
                           <div className="text-[10px] text-green-600 font-semibold">VERIFIED</div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
         
         {/* System Status */}
         <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-4">
            <h2 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">System Status</h2>
            <div className="space-y-2">
               <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-sm border border-slate-100">
                  <div className="flex items-center gap-2">
                     <Clock className="w-4 h-4 text-slate-400" />
                     <span className="text-xs font-semibold text-slate-700">Next Scheduled Scan</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900">12:00 PM EST</span>
               </div>
               <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-sm border border-green-100">
                  <div className="flex items-center gap-2">
                     <Server className="w-4 h-4 text-green-600" />
                     <span className="text-xs font-semibold text-green-800">API Workers</span>
                  </div>
                  <span className="text-xs font-bold text-green-700">Healthy</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg, loading }: any) {
   return (
      <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-4 flex items-start justify-between">
         <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
            {loading ? (
               <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-sm"></div>
            ) : (
               <h3 className="text-2xl font-black text-[#1E293B]">{value}</h3>
            )}
         </div>
         <div className={`p-2 rounded-sm ${bg}`}>
            <Icon className={`w-5 h-5 ${color}`} />
         </div>
      </div>
   )
}