'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, UserCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('ahmed@americanironus.com');
  const [password, setPassword] = useState('password123');
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, login, demoLogin } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoadingState(false);
    }
  };

  const handleQuickDemo = (role: 'SUPER_ADMIN' | 'VIEWER') => {
    if (role === 'SUPER_ADMIN') {
      demoLogin('ahmed@americanironus.com', 'SUPER_ADMIN');
    } else {
      demoLogin('analyst@americanironus.com', 'VIEWER');
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 max-w-sm w-full">
         <div className="flex items-center gap-3 mb-3">
            <Image src="/iron_intel_logo.jpg" alt="IRON INTEL Logo" width={32} height={32} className="rounded-sm" referrerPolicy="no-referrer" />
            <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">IRON INTEL</h1>
         </div>
        <p className="text-xs text-slate-500 mb-5">Acquisition Intelligence & Machinery Monitor</p>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-sm border border-red-100">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs text-[#1E293B] font-medium"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400 text-xs text-[#1E293B] font-medium"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loadingState}
            className="w-full bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-sm hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
          >
            {loadingState ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
            Quick 1-Click Access
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemo('SUPER_ADMIN')}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-sm text-xs font-bold text-orange-800 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            Sign In as Super Admin (Ahmed)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('VIEWER')}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm text-xs font-medium text-slate-700 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            Sign In as Viewer / Analyst
          </button>
        </div>
      </div>
    </div>
  );
}