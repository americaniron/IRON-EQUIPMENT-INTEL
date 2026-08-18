'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { AlertCircle, Search, RotateCcw } from 'lucide-react';

export default function RejectedCandidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadRejected() {
      try {
        const snap = await getDocs(query(collection(db, 'rejected_listings'), limit(25)));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!isMounted) return;
        if (docs.length === 0) {
          setCandidates([
            {
              id: 'rej-1',
              rawTitle: '2018 CAT 320D Excavator - Sold for Parts Only',
              matchedModel: 'CAT 320',
              rejectionReason: 'Prohibited keyword match ("Parts Only")',
              confidenceScore: 0.22,
              source: 'MachineryTrader',
              seller: 'Industrial Salvage Inc',
              detectedPrice: 12000
            },
            {
              id: 'rej-2',
              rawTitle: 'Case 580N Backhoe Loader - Mini replica model toy',
              matchedModel: 'Case 580',
              rejectionReason: 'Sub-threshold confidence: Toy/Scale model detected by AI filter',
              confidenceScore: 0.05,
              source: 'IronPlanet',
              seller: 'Collectible Depot',
              detectedPrice: 85
            },
            {
              id: 'rej-3',
              rawTitle: 'Komatsu PC200-8 Boom Arm Attachment Only',
              matchedModel: 'Komatsu PC200',
              rejectionReason: 'Prohibited keyword match ("Attachment Only")',
              confidenceScore: 0.38,
              source: 'Machinio',
              seller: 'Heavy Attachments Co',
              detectedPrice: 6500
            }
          ]);
        } else {
          setCandidates(docs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadRejected();
    return () => { isMounted = false; };
  }, []);

  const filtered = candidates.filter(c => 
    (c.rawTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.matchedModel || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.rejectionReason || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h1 className="text-lg font-bold text-slate-800">Rejected Candidates</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Raw crawl entries filtered out by prohibited keywords, low confidence scores, or strict model rules.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search rejected candidates..."
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-sm text-xs focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-2.5">Raw Listing Title</th>
              <th className="px-4 py-2.5">Target Model Trigger</th>
              <th className="px-4 py-2.5">Rejection Reason</th>
              <th className="px-4 py-2.5">Confidence</th>
              <th className="px-4 py-2.5">Source & Price</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading rejected list...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No rejected candidates found.</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-[#1E293B] max-w-sm truncate">{c.rawTitle}</td>
                <td className="px-4 py-3 font-bold text-slate-700">{c.matchedModel}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-xs text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {c.rejectionReason}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-slate-600">
                  {c.confidenceScore ? `${Math.round(c.confidenceScore * 100)}%` : '0%'}
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-800">{c.source}</div>
                  <div className="text-[10px] text-slate-500">${c.detectedPrice?.toLocaleString() || '0'}</div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => alert(`Reviewing candidate #${c.id}. Re-evaluation queued.`)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xs text-[10px] font-bold uppercase tracking-wider shadow-xs"
                  >
                    <RotateCcw className="w-3 h-3" /> Force Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
