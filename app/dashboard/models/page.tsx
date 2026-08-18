'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { Sparkles, Plus, X, Check, Loader2, BookOpen, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ModelExpansionResult } from '@/lib/gemini';

export default function ModelDictionary() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeModelAi, setActiveModelAi] = useState<{ model: any; result: ModelExpansionResult } | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);

  // New model form state
  const [newMan, setNewMan] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newCat, setNewCat] = useState('Heavy Equipment');
  const [aiSuggestions, setAiSuggestions] = useState<ModelExpansionResult | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchModels() {
      try {
        let docs: any[] = [];
        try {
          const snap = await getDocs(collection(db, 'target_models'));
          docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.warn('Firestore models load fallback', e);
        }

        if (docs.length === 0) {
          setModels([
            // 1-10 Caterpillar Wheel Loaders
            { id: 'cat-966f', manufacturer: 'Caterpillar', model: '966F', category: 'Wheel Loader', aliases: ['CAT 966F', '966 F', 'Caterpillar 966F'], prohibitedVariants: ['966G', '966H', '966E', '966D', '966M', '966K'], status: 'active' },
            { id: 'cat-936f', manufacturer: 'Caterpillar', model: '936F', category: 'Wheel Loader', aliases: ['CAT 936F', '936 F', 'Caterpillar 936F'], prohibitedVariants: ['936E', '936G', '936H', '936'], status: 'active' },
            { id: 'cat-936e', manufacturer: 'Caterpillar', model: '936E', category: 'Wheel Loader', aliases: ['CAT 936E', '936 E', 'Caterpillar 936E'], prohibitedVariants: ['936F', '936G', '936'], status: 'active' },
            { id: 'cat-950e', manufacturer: 'Caterpillar', model: '950E', category: 'Wheel Loader', aliases: ['CAT 950E', '950 E', 'Caterpillar 950E'], prohibitedVariants: ['950F', '950G', '950H', '950K', '950M', '950 GC', '0950E', '950-EF'], status: 'active' },
            { id: 'cat-970f', manufacturer: 'Caterpillar', model: '970F', category: 'Wheel Loader', aliases: ['CAT 970F', '970 F', 'Caterpillar 970F'], prohibitedVariants: ['970G', '970H', '970E'], status: 'active' },
            { id: 'cat-972g', manufacturer: 'Caterpillar', model: '972G', category: 'Wheel Loader', aliases: ['CAT 972G', '972 G', 'Caterpillar 972G'], prohibitedVariants: ['972H', '972M', '972K', '972'], status: 'active' },
            { id: 'cat-972h', manufacturer: 'Caterpillar', model: '972H', category: 'Wheel Loader', aliases: ['CAT 972H', '972 H', 'Caterpillar 972H'], prohibitedVariants: ['972G', '972M', '972K', '972'], status: 'active' },
            { id: 'cat-966h', manufacturer: 'Caterpillar', model: '966H', category: 'Wheel Loader', aliases: ['CAT 966H', '966 H', 'Caterpillar 966H'], prohibitedVariants: ['966F', '966G', '966M', '966K'], status: 'active' },
            { id: 'cat-966e', manufacturer: 'Caterpillar', model: '966E', category: 'Wheel Loader', aliases: ['CAT 966E', '966 E', 'Caterpillar 966E'], prohibitedVariants: ['966F', '966D', '966G'], status: 'active' },
            { id: 'cat-966d', manufacturer: 'Caterpillar', model: '966D', category: 'Wheel Loader', aliases: ['CAT 966D', '966 D', 'Caterpillar 966D'], prohibitedVariants: ['966E', '966F', '966G'], status: 'active' },

            // 11-12 Caterpillar Motor Graders
            { id: 'cat-14g', manufacturer: 'Caterpillar', model: '14G', category: 'Motor Grader', aliases: ['CAT 14G', '14 G', 'Caterpillar 14G'], prohibitedVariants: ['14H', '14M', '140G', '140H'], status: 'active' },
            { id: 'cat-14h', manufacturer: 'Caterpillar', model: '14H', category: 'Motor Grader', aliases: ['CAT 14H', '14 H', 'Caterpillar 14H'], prohibitedVariants: ['14G', '14M', '140H', '140M'], status: 'active' },

            // 13-16 Caterpillar Bulldozers
            { id: 'cat-d9n', manufacturer: 'Caterpillar', model: 'D9N', category: 'Bulldozer', aliases: ['CAT D9N', 'D9 N', 'Caterpillar D9N'], prohibitedVariants: ['D9R', 'D9T', 'D9H', 'D9L'], status: 'active' },
            { id: 'cat-d9r', manufacturer: 'Caterpillar', model: 'D9R', category: 'Bulldozer', aliases: ['CAT D9R', 'D9 R', 'Caterpillar D9R'], prohibitedVariants: ['D9N', 'D9T', 'D9H', 'D9L'], status: 'active' },
            { id: 'cat-d10n', manufacturer: 'Caterpillar', model: 'D10N', category: 'Bulldozer', aliases: ['CAT D10N', 'D10 N', 'Caterpillar D10N'], prohibitedVariants: ['D10R', 'D10T', 'D10N/R'], status: 'active' },
            { id: 'cat-d10r', manufacturer: 'Caterpillar', model: 'D10R', category: 'Bulldozer', aliases: ['CAT D10R', 'D10 R', 'Caterpillar D10R'], prohibitedVariants: ['D10N', 'D10T'], status: 'active' },

            // 17 John Deere Wheel Excavator
            { id: 'jd-595d', manufacturer: 'John Deere', model: '595D', category: 'Wheel Excavator', aliases: ['DEERE 595D', '595 D', 'John Deere 595D'], prohibitedVariants: ['595', '590D', '690D'], status: 'active' },

            // 18-21 Volvo Wheel Excavators
            { id: 'volvo-130', manufacturer: 'Volvo', model: '130', category: 'Wheel Excavator', aliases: ['VOLVO 130', 'VOLVO EW130', 'Volvo 130 Wheeled'], prohibitedVariants: ['EC130', '135', '140'], status: 'active' },
            { id: 'volvo-140', manufacturer: 'Volvo', model: '140', category: 'Wheel Excavator', aliases: ['VOLVO 140', 'VOLVO EW140', 'Volvo 140 Wheeled'], prohibitedVariants: ['EC140', '140 Track', '130', '170'], status: 'active' },
            { id: 'volvo-170', manufacturer: 'Volvo', model: '170', category: 'Wheel Excavator', aliases: ['VOLVO 170', 'VOLVO EW170', 'Volvo 170 Wheeled'], prohibitedVariants: ['EC170', '170 Track', '160', '180'], status: 'active' },
            { id: 'volvo-180', manufacturer: 'Volvo', model: '180', category: 'Wheel Excavator', aliases: ['VOLVO 180', 'VOLVO EW180', 'Volvo 180 Wheeled'], prohibitedVariants: ['EC180', '180 Track', '170', '210'], status: 'active' }
          ]);
        } else {
          setModels(docs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  const handleAiExpand = async (m: any) => {
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/suggest-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manufacturer: m.manufacturer,
          model: m.model,
          category: m.category,
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setActiveModelAi({ model: m, result: data.suggestions });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleFetchSuggestionsForNew = async () => {
    if (!newMan || !newModel) return;
    setGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/suggest-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manufacturer: newMan,
          model: newModel,
          category: newCat,
        }),
      });
      const data = await res.json();
      if (data.success && data.suggestions) {
        setAiSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSaveNewTarget = async () => {
    if (!newMan || !newModel) return;
    setSaving(true);
    try {
      const id = `${newMan.toLowerCase().replace(/[^a-z0-9]/g, '')}-${newModel.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      const newRecord = {
        manufacturer: newMan,
        model: newModel,
        category: newCat,
        aliases: aiSuggestions?.suggestedAliases || [`${newMan} ${newModel}`, newModel],
        prohibitedVariants: aiSuggestions?.prohibitedVariants || [],
        status: 'active',
        createdAt: new Date(),
      };

      try {
        await setDoc(doc(db, 'target_models', id), newRecord);
      } catch (e) {
        console.warn('Firestore write fallback', e);
      }

      setModels(prev => [...prev, { id, ...newRecord }]);
      setShowModal(false);
      setNewMan('');
      setNewModel('');
      setAiSuggestions(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            <h1 className="text-lg font-bold text-slate-800">Target Model Dictionary</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Exact match criteria, accepted seller aliases, and prohibited variant rules for acquisition scanning.
          </p>
        </div>

        <button 
          onClick={() => { setShowModal(true); setAiSuggestions(null); }}
          className="bg-[#0F172A] hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Target Model
        </button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Manufacturer</th>
                <th className="px-4 py-2.5">Exact Model</th>
                <th className="px-4 py-2.5">Category</th>
                <th className="px-4 py-2.5">Accepted Aliases</th>
                <th className="px-4 py-2.5">Prohibited Suffix Variants</th>
                <th className="px-4 py-2.5 text-right">AI Spec Expansion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading models...</td></tr>
              ) : models.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#1E293B]">{m.manufacturer}</td>
                  <td className="px-4 py-3 font-bold text-[#1E293B] bg-orange-50/40">
                    {m.model}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{m.category}</td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                    {m.aliases?.length ? m.aliases.join(', ') : <span className="text-slate-400 italic">None</span>}
                  </td>
                  <td className="px-4 py-3 text-red-700 font-mono text-[11px] max-w-xs truncate">
                    {m.prohibitedVariants?.length ? m.prohibitedVariants.join(', ') : <span className="text-slate-400 italic">None</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleAiExpand(m)}
                      disabled={generatingAi}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 rounded-sm text-[10px] font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 text-orange-600" />
                      Expand Specs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Expansion Details Modal */}
      {activeModelAi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm">
                  Gemini Model Intelligence: {activeModelAi.model.manufacturer} {activeModelAi.model.model}
                </h3>
              </div>
              <button onClick={() => setActiveModelAi(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="p-3 bg-slate-50 rounded-sm border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-500">Market Intelligence</div>
                <p className="text-slate-800 leading-relaxed">{activeModelAi.result.marketInsights}</p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Detected Seller Aliases</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeModelAi.result.suggestedAliases.map((a, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-xs font-mono text-[11px]">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-red-800 uppercase tracking-wider text-[10px]">Prohibited / False-Positive Variants</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeModelAi.result.prohibitedVariants.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded-xs font-mono text-[11px]">
                      ⛔ {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Chassis Physical Inspection Checklist</div>
                <ul className="space-y-1 bg-slate-50 p-3 rounded-sm border border-slate-200">
                  {activeModelAi.result.inspectionChecklist.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveModelAi(null)}
                className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-sm text-xs font-bold uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Target Model with AI Auto-fill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-400" />
                <h3 className="font-bold text-sm">Add New Target Acquisition Model</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Manufacturer</label>
                  <input
                    type="text"
                    placeholder="e.g. Caterpillar, Komatsu, Volvo"
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:ring-1 focus:ring-slate-400 focus:outline-none"
                    value={newMan}
                    onChange={e => setNewMan(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Exact Model Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. 336F L, PC390LC-11, 744L"
                    className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:ring-1 focus:ring-slate-400 focus:outline-none"
                    value={newModel}
                    onChange={e => setNewModel(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs focus:ring-1 focus:ring-slate-400 focus:outline-none bg-white"
                  value={newCat}
                  onChange={e => setNewCat(e.target.value)}
                >
                  <option value="Crawler Excavator">Crawler Excavator</option>
                  <option value="Wheel Loader">Wheel Loader</option>
                  <option value="Crawler Dozer">Crawler Dozer</option>
                  <option value="Articulated Dump Truck">Articulated Dump Truck</option>
                  <option value="Motor Grader">Motor Grader</option>
                  <option value="Compactor / Roller">Compactor / Roller</option>
                  <option value="Skid Steer / Track Loader">Skid Steer / Track Loader</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFetchSuggestionsForNew}
                  disabled={!newMan || !newModel || generatingAi}
                  className="w-full py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {generatingAi ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Querying Gemini Model Intelligence...</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5 text-orange-600" /> Auto-Generate Aliases & Prohibited Variants via Gemini</>
                  )}
                </button>
              </div>

              {aiSuggestions && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-2 animate-in fade-in">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-500">Auto-Detected Aliases:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiSuggestions.suggestedAliases.map((a, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-xs font-mono text-[10px]">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-red-600">Auto-Flagged Prohibited Suffixes:</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiSuggestions.prohibitedVariants.map((p, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-red-100 text-red-800 rounded-xs font-mono text-[10px]">⛔ {p}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-sm text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewTarget}
                disabled={!newMan || !newModel || saving}
                className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-sm text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add to Target Dictionary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
