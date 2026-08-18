'use client';

import { useState } from 'react';
import { Settings, Save, Bell, Sliders } from 'lucide-react';

export default function SettingsPage() {
  const [scheduleTimezone, setScheduleTimezone] = useState('America/New_York');
  const [currency, setCurrency] = useState('USD');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-500" />
          <h1 className="text-lg font-bold text-slate-800">Acquisition & Platform Settings</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure crawler thresholds, notification preferences, and currency standards.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-sm">
          ✓ Configuration settings updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 shadow-sm rounded-sm p-6 space-y-6">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-slate-600" /> Ingestion & Matching Engine
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Minimum Match Confidence ({confidenceThreshold}%)
              </label>
              <input 
                type="range" 
                min="50" 
                max="99" 
                value={confidenceThreshold}
                onChange={e => setConfidenceThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-[11px] text-slate-500">Listings scoring below this threshold are routed to Rejected Candidates.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Base Currency Normalization</label>
              <select 
                value={currency} 
                onChange={e => setCurrency(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-sm text-xs bg-white text-slate-800 font-medium"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="CAD">CAD ($) - Canadian Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-slate-600" /> Scheduled Scans & Alerts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Crawler Timezone</label>
              <select 
                value={scheduleTimezone} 
                onChange={e => setScheduleTimezone(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-sm text-xs bg-white text-slate-800 font-medium"
              >
                <option value="America/New_York">Eastern Time (America/New_York)</option>
                <option value="America/Chicago">Central Time (America/Chicago)</option>
                <option value="America/Denver">Mountain Time (America/Denver)</option>
                <option value="America/Los_Angeles">Pacific Time (America/Los_Angeles)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input 
                type="checkbox" 
                id="emailAlerts" 
                checked={emailAlerts} 
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-orange-500 rounded border-slate-300 focus:ring-orange-400"
              />
              <label htmlFor="emailAlerts" className="text-xs font-bold text-slate-700 cursor-pointer">
                Send email alerts on newly verified high-priority matches
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button 
            type="submit"
            className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" /> Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
}
