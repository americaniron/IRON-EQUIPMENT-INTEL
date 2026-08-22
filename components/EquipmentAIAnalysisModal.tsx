'use client';

import React, { useState } from 'react';
import { 
  Sparkles, X, CheckCircle2, AlertTriangle, XCircle, 
  TrendingUp, ShieldCheck, DollarSign, Gauge, 
  Layers, FileText, Loader2, ArrowUpRight, Check 
} from 'lucide-react';
import { EquipmentAnalysisResult } from '@/lib/gemini';

interface EquipmentAIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: any;
}

export function EquipmentAIAnalysisModal({ isOpen, onClose, listing }: EquipmentAIAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<EquipmentAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen || !listing) return;

    let isMounted = true;
    async function runAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: listing.title || `${listing.manufacturer || ''} ${listing.model || ''}`,
            manufacturer: listing.manufacturer,
            model: listing.model,
            targetModel: listing.targetModel || listing.model,
            targetManufacturer: listing.targetManufacturer || listing.manufacturer,
            category: listing.category,
            year: listing.year,
            hours: listing.hours,
            price: listing.price,
            seller: listing.seller,
            location: listing.location,
            description: listing.description || listing.issue || '',
          }),
        });

        const data = await res.json();
        if (!isMounted) return;
        if (data.success && data.analysis) {
          setAnalysis(data.analysis);
        } else {
          let errorMsg = data.error || 'Failed to complete AI analysis';
          if (errorMsg.includes('resource_exhausted') || errorMsg.includes('Quota exceeded') || res.status === 429) {
            errorMsg = 'Gemini API Rate Limit Exceeded: You have exhausted your current AI Studio token quota. Please wait for the quota to refresh or check your API billing tier in Google Cloud.';
          }
          setError(errorMsg);
        }
      } catch (err: any) {
        if (!isMounted) return;
        let errorMsg = err?.message || 'Network error while analyzing equipment';
        if (errorMsg.includes('resource_exhausted') || errorMsg.includes('Quota exceeded')) {
            errorMsg = 'Gemini API Rate Limit Exceeded: You have exhausted your current AI Studio token quota. Please wait for the quota to refresh or check your API billing tier in Google Cloud.';
        }
        setError(errorMsg);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    runAnalysis();
    return () => { isMounted = false; };
  }, [isOpen, listing]);

  if (!isOpen) return null;

  const askingPrice = typeof listing?.price === 'number' ? listing.price : parseFloat(String(listing?.price || '0')) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-md shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-orange-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Gemini Equipment Intelligence</h2>
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xs text-[10px] font-mono uppercase tracking-wider">
                  gemini-3.7-flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {listing?.manufacturer} {listing?.model} • {listing?.year || 'Year N/A'} • {typeof listing?.hours === 'number' ? `${listing.hours.toLocaleString()} hrs` : 'Hours unlisted'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <div>
                <p className="text-sm font-bold text-slate-800">Analyzing Machine Specs & Market Valuations...</p>
                <p className="text-xs text-slate-500">Cross-referencing exact model variants, component wear curves, and secondary wholesale transaction comps.</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4" /> Analysis Error
              </div>
              <p>{error}</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              
              {/* Top Banner: Acquisition Verdict & Key Metrics */}
              <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">AI Acquisition Verdict</span>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-xs font-black tracking-wider uppercase ${
                      analysis.valuation.verdict === 'STRONG_BUY' ? 'bg-green-100 text-green-800 border border-green-300' :
                      analysis.valuation.verdict === 'FAIR_ACQUISITION' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      analysis.valuation.verdict === 'CAUTION_INVESTIGATE' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-red-100 text-red-800 border border-red-300'
                    }`}>
                      {analysis.valuation.verdict === 'STRONG_BUY' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {analysis.valuation.verdict === 'FAIR_ACQUISITION' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {analysis.valuation.verdict === 'CAUTION_INVESTIGATE' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {analysis.valuation.verdict.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Deal Quality Score</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900">{analysis.valuation.dealScore}</span>
                    <span className="text-xs text-slate-400 font-bold">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Model Exact Match</span>
                  <div className="flex items-center gap-1.5">
                    {analysis.modelMatch.isExactMatch ? (
                      <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        {analysis.modelMatch.confidenceScore}% Verified
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        Mismatch Flagged
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Condition Grade</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-orange-600">{analysis.conditionEstimation.grade}</span>
                    <span className="text-xs text-slate-600 font-medium">({analysis.conditionEstimation.conditionScore}/100)</span>
                  </div>
                </div>
              </div>

              {/* 3 Main Deep Pillars: Model Matching, Condition, Valuation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Pillar 1: Model Matching & Specs */}
                <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Layers className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">1. Exact Model Integrity</h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-sm border border-slate-100">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Detected Designation</div>
                      <div className="font-bold text-slate-900 mt-0.5">
                        {analysis.modelMatch.detectedManufacturer} {analysis.modelMatch.detectedModel}
                      </div>
                      {analysis.modelMatch.detectedSeries && (
                        <div className="text-[11px] text-slate-600 mt-0.5">Series: {analysis.modelMatch.detectedSeries}</div>
                      )}
                    </div>

                    {analysis.modelMatch.subvariantWarnings?.length > 0 && (
                      <div className="p-2 bg-amber-50 rounded-sm border border-amber-200 text-amber-800 text-[11px]">
                        <span className="font-bold">Variant Warnings:</span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5">
                          {analysis.modelMatch.subvariantWarnings.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.modelMatch.isPartOrAttachment && (
                      <div className="p-2 bg-red-50 rounded-sm border border-red-200 text-red-800 text-[11px] font-bold">
                        ⚠️ WARNING: Classified as component, part, or attachment, not whole chassis.
                      </div>
                    )}

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {analysis.modelMatch.reasoning}
                    </p>
                  </div>
                </div>

                {/* Pillar 2: Condition & Wear Curve */}
                <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Gauge className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">2. Condition & Wear Curve</h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400">Wear Tier</div>
                        <div className="font-bold text-slate-900 mt-0.5">{analysis.conditionEstimation.wearTier}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase text-slate-400">Burn Ratio</div>
                        <div className="font-bold text-slate-700 text-[11px]">
                          ~{analysis.conditionEstimation.hoursPerYearRatio.toLocaleString()} hrs/yr
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {analysis.conditionEstimation.summary}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Component Risk Breakdown</div>
                      {analysis.conditionEstimation.componentRiskFactors.map((comp, idx) => (
                        <div key={idx} className="p-1.5 bg-slate-50 rounded-xs border border-slate-100 flex items-start justify-between gap-2 text-[11px]">
                          <div>
                            <span className="font-bold text-slate-800">{comp.component}:</span>{' '}
                            <span className="text-slate-600">{comp.note}</span>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded-xs text-[9px] font-extrabold uppercase shrink-0 ${
                            comp.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                            comp.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {comp.riskLevel}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pillar 3: Valuation & Target Margin */}
                <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <DollarSign className="w-4 h-4 text-slate-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">3. Market Valuation & Spread</h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Asking Price:</span>
                        <span className="font-bold text-slate-900">
                          {askingPrice ? `$${askingPrice.toLocaleString()}` : 'Unlisted'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Est. Wholesale Auction:</span>
                        <span className="font-semibold text-slate-700">
                          ${analysis.valuation.wholesaleAuctionValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Est. Retail Target:</span>
                        <span className="font-bold text-green-700">
                          ${analysis.valuation.retailTargetValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-100">
                        <span className="font-bold text-slate-700">Estimated Margin:</span>
                        <span className={`font-black ${analysis.valuation.marginPotentialUSD >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {analysis.valuation.marginPotentialUSD >= 0 ? '+' : ''}${analysis.valuation.marginPotentialUSD.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-sm border border-slate-100">
                      <div className="text-[10px] font-bold uppercase text-slate-400">Positioning</div>
                      <div className="font-bold text-slate-800 text-[11px]">{analysis.valuation.pricePosition}</div>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {analysis.valuation.summary}
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom Row: Negotiation Leverage & Acquisition Action Plan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                    Negotiation Talking Points
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {analysis.valuation.negotiationPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Recommended Acquisition Actions
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Powered by Google Gemini 3.7 Flash Model Matching & Valuation Engine
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
