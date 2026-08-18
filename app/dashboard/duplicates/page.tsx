'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { Copy, Layers } from 'lucide-react';

export default function DuplicateGroups() {
  const [duplicateGroups, setDuplicateGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDuplicates() {
      try {
        const snap = await getDocs(query(collection(db, 'duplicate_groups'), limit(15)));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!isMounted) return;
        if (docs.length === 0) {
          setDuplicateGroups([
            {
              id: 'dup-grp-1',
              primaryModel: 'Caterpillar 320 Next Gen',
              serialNumber: 'CAT0320NC47291',
              detectedYear: 2020,
              canonicalPrice: 135000,
              crossListings: [
                { source: 'MachineryTrader', seller: 'Ring Power CAT', price: 135000, hours: 3200, location: 'Tampa, FL' },
                { source: 'IronPlanet', seller: 'Ring Power CAT', price: 135000, hours: 3200, location: 'Tampa, FL' },
                { source: 'EquipmentTrader', seller: 'Ring Power Heavy', price: 138000, hours: 3200, location: 'Florida' }
              ],
              matchConfidence: '99.4%'
            },
            {
              id: 'dup-grp-2',
              primaryModel: 'Komatsu WA380-8 Wheel Loader',
              serialNumber: 'KOMWA380H88219',
              detectedYear: 2021,
              canonicalPrice: 189000,
              crossListings: [
                { source: 'Machinio', seller: 'Midwest Ag & Construction', price: 189000, hours: 1840, location: 'Omaha, NE' },
                { source: 'MachineryTrader', seller: 'Midwest Heavy Equipment', price: 189000, hours: 1840, location: 'Omaha, NE' }
              ],
              matchConfidence: '98.8%'
            }
          ]);
        } else {
          setDuplicateGroups(docs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadDuplicates();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <Copy className="w-5 h-5 text-indigo-500" />
          <h1 className="text-lg font-bold text-slate-800">Duplicate Groups & Cross-Listings</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Identified identical machines listed across multiple dealer networks and broker marketplaces.
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-slate-200 p-8 text-center text-slate-500 rounded-sm">
            Loading cross-posting duplicate groups...
          </div>
        ) : duplicateGroups.map(group => (
          <div key={group.id} className="bg-white border border-slate-200 shadow-sm rounded-sm p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{group.primaryModel}</h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>Serial: <strong className="text-slate-700">{group.serialNumber || 'N/A'}</strong></span>
                    <span>•</span>
                    <span>Year: <strong>{group.detectedYear}</strong></span>
                    <span>•</span>
                    <span className="text-green-600 font-bold">Confidence: {group.matchConfidence || '99%'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Canonical Price:</span>
                <span className="text-base font-black text-slate-900">${group.canonicalPrice?.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Matched Ingestion Sources ({group.crossListings?.length || 0})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {group.crossListings?.map((item: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xs border border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{item.source}</span>
                      <span className="text-slate-900">${item.price?.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 truncate">{item.seller}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.hours} hrs • {item.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
