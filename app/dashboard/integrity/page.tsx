'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { AlertTriangle, Search, Sparkles } from 'lucide-react';
import { EquipmentAIAnalysisModal } from '@/components/EquipmentAIAnalysisModal';

export default function DataIntegrityQueue() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [resolvedIds, setResolvedIds] = useState<Record<string, 'approved' | 'dismissed'>>({});
  const [inspectListing, setInspectListing] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadIntegrityItems() {
      try {
        const snap = await getDocs(query(collection(db, 'raw_listings'), limit(25)));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!isMounted) return;
        if (docs.length === 0) {
          setItems([
            {
              id: 'int-101',
              title: '2019 CAT 320 GC Excavator - Low Price Alert',
              manufacturer: 'Caterpillar',
              model: '320 GC',
              category: 'Hydraulic Excavator',
              year: 2019,
              hours: 2800,
              price: 18500,
              seller: 'Industrial Direct Auctions LLC',
              location: 'Dallas, TX',
              source: 'MachineryTrader',
              issue: 'Price $18,500 is >65% below model average ($95,000)',
              severity: 'HIGH',
              detectedAt: '10 mins ago',
              suggestedAction: 'Verify seller authenticity or check for down-payment pricing'
            },
            {
              id: 'int-102',
              title: 'Komatsu PC210LC-11 missing serial plate OCR',
              manufacturer: 'Komatsu',
              model: 'PC210LC-11',
              category: 'Crawler Excavator',
              year: 2021,
              hours: 0,
              price: 145000,
              seller: 'EquipNet Fleet Services',
              location: 'Peoria, IL',
              source: 'IronPlanet',
              issue: 'Year 2021 declared but hours listed as 0 with no image serial match',
              severity: 'MEDIUM',
              detectedAt: '35 mins ago',
              suggestedAction: 'Manual spec validation'
            },
            {
              id: 'int-103',
              title: 'John Deere 850K Dozer with ambiguous model variant',
              manufacturer: 'John Deere',
              model: '850K',
              category: 'Crawler Dozer',
              year: 2018,
              hours: 4200,
              price: 112000,
              seller: 'Heartland Machinery Supply',
              location: 'Des Moines, IA',
              source: 'Machinio',
              issue: 'Listing contains both "850K" and "850J" in body text',
              severity: 'LOW',
              detectedAt: '1 hour ago',
              suggestedAction: 'Confirm exact sub-series prefix'
            }
          ]);
        } else {
          setItems(docs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadIntegrityItems();
    return () => { isMounted = false; };
  }, []);

  const handleAction = (id: string, action: 'approved' | 'dismissed') => {
    setResolvedIds(prev => ({ ...prev, [id]: action }));
  };

  const filtered = items.filter(i => 
    (i.title || i.model || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.issue || i.source || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h1 className="text-lg font-bold text-slate-800">Data Integrity Queue</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Flagged listings requiring manual validation, outlier verification, or duplicate resolution.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search integrity queue..."
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
                <th className="px-4 py-2.5">Flagged Entity</th>
                <th className="px-4 py-2.5">Source</th>
                <th className="px-4 py-2.5">Severity</th>
                <th className="px-4 py-2.5">Detected Issue</th>
                <th className="px-4 py-2.5">AI Valuation & Spec Match</th>
                <th className="px-4 py-2.5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Loading integrity queue...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-green-600 font-medium">
                    Integrity queue clear. No anomalies flagged.
                  </td>
                </tr>
              ) : filtered.map(item => {
                const status = resolvedIds[item.id];
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#1E293B]">
                      {item.title || item.model || 'Scraped Record #' + item.id.slice(0, 6)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {item.source || item.sourceId || 'MachinerySource'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-xs text-[10px] font-extrabold uppercase tracking-wider ${
                        item.severity === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-200' :
                        item.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {item.severity || 'WARN'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                      {item.issue || 'Data validation anomaly detected'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setInspectListing(item)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 rounded-xs text-[10px] font-extrabold uppercase tracking-wider transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-orange-600" />
                        AI Deep Audit
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {status ? (
                        <span className={`text-[11px] font-bold uppercase ${status === 'approved' ? 'text-green-600' : 'text-slate-400'}`}>
                          {status === 'approved' ? '✓ Verified' : '✕ Dismissed'}
                        </span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAction(item.id, 'approved')}
                            className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-xs text-[10px] font-bold uppercase tracking-wider"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleAction(item.id, 'dismissed')}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xs text-[10px] font-bold uppercase tracking-wider"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
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
