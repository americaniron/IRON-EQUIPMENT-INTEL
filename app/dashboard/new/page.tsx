'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { Sparkles, ExternalLink, Search, Clock } from 'lucide-react';
import Image from 'next/image';
import { EquipmentAIAnalysisModal } from '@/components/EquipmentAIAnalysisModal';

export default function NewToday() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectListing, setInspectListing] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadNewToday() {
      try {
        let docs: any[] = [];
        try {
          const qFallback = query(
            collection(db, 'verified_listings'),
            orderBy('firstDiscovered', 'desc')
          );
          const snap = await getDocs(qFallback);
          docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.warn('Firestore fetch fallback trigger:', e);
        }

        if (docs.length === 0) {
          const res = await fetch('/api/verified-listings');
          if (res.ok) {
            const data = await res.json();
            if (data.listings && Array.isArray(data.listings)) {
              docs = data.listings;
            }
          }
        }
        
        if (isMounted) {
          setMatches(docs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadNewToday();
    return () => { isMounted = false; };
  }, []);

  const filtered = matches.filter(m => 
    (m.model || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.seller || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.manufacturer || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.sourceId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h1 className="text-lg font-bold text-slate-800">New Today</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Heavy machinery & equipment listings discovered during the last 24-hour cycle.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filter by model, seller, source..."
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-sm text-xs focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Machine / Model</th>
                <th className="px-4 py-2.5">Price</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Year / Hours</th>
                <th className="px-4 py-2.5">Discovered</th>
                <th className="px-4 py-2.5">Source & Location</th>
                <th className="px-4 py-2.5">Seller Info</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Loading new acquisitions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No new equipment listings discovered today yet. Next scan will run automatically.
                  </td>
                </tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-slate-100 rounded-sm overflow-hidden relative border border-slate-200 shrink-0">
                        {m.primaryImage ? (
                          <Image src={m.primaryImage} alt={m.model || 'Equipment'} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400 font-bold">NO IMG</div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[#1E293B] flex items-center gap-1.5">
                          {m.manufacturer} {m.model}
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 font-extrabold text-[9px] rounded-xs uppercase">NEW</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{m.category || 'Equipment'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-bold text-[#1E293B]">
                    {m.price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: m.currency || 'USD' }).format(m.price) : 'Contact for Price'}
                  </td>
                  <td className="px-4 py-2.5">
                     <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-[10px] font-bold text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        {m.saleStatus || 'Live Auction'}
                     </div>
                     {m.auctionCloseDate && (
                        <div className="text-[10px] text-slate-500 mt-1">
                           Closes: {new Date(m.auctionCloseDate).toLocaleDateString()}
                        </div>
                     )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="text-[#1E293B] font-medium">{m.year || 'N/A'}</div>
                    <div className="text-[10px] text-slate-500">{typeof m.hours === 'number' ? `${m.hours.toLocaleString()} hrs` : 'Hours unlisted'}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span>Today</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-800">{m.sourceId || 'Direct'}</div>
                    <div className="text-[10px] text-slate-500">{m.location || 'United States'}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="font-semibold text-slate-700 text-[11px]">{m.seller || 'Verified Dealer'}</div>
                    <div className="text-[10px] text-slate-500">{m.phone || m.email || 'Direct inquiry'}</div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setInspectListing(m)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 rounded-sm text-[11px] font-bold transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-orange-600" /> AI Appraisal
                      </button>
                      {m.url ? (
                        <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 shadow-xs rounded-sm text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                          Inspect <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">Archived</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gemini AI Inspector Modal */}
      <EquipmentAIAnalysisModal
        isOpen={!!inspectListing}
        onClose={() => setInspectListing(null)}
        listing={inspectListing}
      />
    </div>
  );
}
