'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { ExternalLink, Search, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { EquipmentAIAnalysisModal } from '@/components/EquipmentAIAnalysisModal';

export default function VerifiedMatches() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [inspectListing, setInspectListing] = useState<any | null>(null);

  useEffect(() => {
    async function loadMatches() {
      try {
        let docs: any[] = [];
        try {
          const q = query(collection(db, 'verified_listings'), orderBy('firstDiscovered', 'desc'));
          const snap = await getDocs(q);
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

        setMatches(docs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const filtered = matches.filter(m => 
    (m.model || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.seller || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.sourceId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
         <h1 className="text-lg font-bold text-slate-800">Verified Matches</h1>
         <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
               type="text" 
               placeholder="Search model, seller, source..."
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
                     <th className="px-4 py-2.5">Machine</th>
                     <th className="px-4 py-2.5">Price</th>
                     <th className="px-4 py-2.5">Status</th>
                     <th className="px-4 py-2.5">Year / Hours</th>
                     <th className="px-4 py-2.5">Location</th>
                     <th className="px-4 py-2.5">Source & Seller</th>
                     <th className="px-4 py-2.5">Contact</th>
                     <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {loading ? (
                     <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading verified matches...</td></tr>
                  ) : filtered.length === 0 ? (
                     <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No verified matches found.</td></tr>
                  ) : filtered.map(m => (
                     <tr 
                        key={m.id} 
                        onClick={() => window.open(m.url, '_blank')}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                     >
                        <td className="px-4 py-2">
                           <div className="flex items-center gap-3">
                              <div className="w-12 h-8 bg-slate-100 rounded-sm overflow-hidden relative border border-slate-200 shrink-0">
                                 {m.primaryImage ? (
                                    <Image src={m.primaryImage} alt={m.model} fill className="object-cover" referrerPolicy="no-referrer" />
                                 ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400 font-bold">NO IMG</div>
                                 )}
                              </div>
                              <div>
                                 <div className="font-bold text-[#1E293B]">{m.manufacturer} {m.model}</div>
                                 <div className="text-[10px] text-slate-500">{m.category}</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-4 py-2">
                           <div className="font-bold text-[#1E293B]">{new Intl.NumberFormat('en-US', { style: 'currency', currency: m.currency || 'USD' }).format(m.price)}</div>
                        </td>
                        <td className="px-4 py-2">
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
                        <td className="px-4 py-2">
                           <div className="text-[#1E293B] font-medium">{m.year}</div>
                           <div className="text-[10px] text-slate-500">{typeof m.hours === 'number' ? `${m.hours.toLocaleString()} hrs` : 'Hours unlisted'}</div>
                        </td>
                        <td className="px-4 py-2 text-slate-600">{m.location}</td>
                        <td className="px-4 py-2">
                           <div className="font-bold text-slate-800">{m.sourceId}</div>
                           <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{m.seller}</div>
                        </td>
                        <td className="px-4 py-2">
                           <div className="text-[11px] text-slate-700 font-medium">{m.phone}</div>
                           <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{m.email}</div>
                        </td>
                        <td className="px-4 py-2 text-right">
                           <div className="inline-flex items-center gap-2">
                              <button
                                 onClick={(e) => { e.stopPropagation(); setInspectListing(m); }}
                                 className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 rounded-sm text-[11px] font-bold transition-colors"
                              >
                                 <Sparkles className="w-3 h-3 text-orange-600" /> AI Valuation
                              </button>
                              <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 shadow-xs rounded-sm text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                                 Source <ExternalLink className="w-3 h-3" />
                              </a>
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