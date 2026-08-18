'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
   LayoutDashboard, CheckCircle2, CalendarDays, AlertTriangle, 
   List, CheckSquare, Search, AlertCircle, Copy, Bell, 
   Settings, Users, ShieldAlert, Activity, BookOpen
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

const NAVIGATION = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Verified Matches', href: '/dashboard/matches', icon: CheckCircle2 },
  { name: 'New Today', href: '/dashboard/new', icon: CalendarDays },
  { name: 'Data Integrity Queue', href: '/dashboard/integrity', icon: AlertTriangle },
  { name: 'Source Coverage', href: '/dashboard/sources', icon: List },
  { name: 'Model Dictionary', href: '/dashboard/models', icon: BookOpen },
  { name: 'Search Runs', href: '/dashboard/scans', icon: Search },
  { name: 'Rejected Candidates', href: '/dashboard/rejected', icon: AlertCircle },
  { name: 'Duplicate Groups', href: '/dashboard/duplicates', icon: Copy },
  { name: 'Alerts', href: '/dashboard/alerts', icon: Bell },
  { name: 'User Management', href: '/dashboard/users', icon: Users, adminOnly: true },
  { name: 'Audit Logs', href: '/dashboard/audit', icon: ShieldAlert, adminOnly: true },
  { name: 'System Health', href: '/dashboard/health', icon: Activity, adminOnly: true },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-gray-50">Loading IRON INTEL...</div>;
  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#1E293B] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-full shrink-0 border-r border-slate-800">
         <div className="p-6 flex items-center gap-3 border-b border-slate-800 shrink-0">
            <Image src="/iron_intel_logo.jpg" alt="IRON INTEL Logo" width={32} height={32} className="rounded" referrerPolicy="no-referrer" />
            <span className="font-bold text-white tracking-tight text-lg">IRON INTEL</span>
         </div>
         <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
               {NAVIGATION.map(item => {
                  if (item.adminOnly && userData?.role !== 'SUPER_ADMIN' && userData?.role !== 'ADMIN') return null;
                  const isActive = pathname === item.href;
                  return (
                     <li key={item.name}>
                        <Link href={item.href} className={clsx(
                           "px-4 py-2.5 rounded-md flex items-center gap-3 text-sm font-medium transition-colors",
                           isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800 hover:text-white"
                        )}>
                           <item.icon className="w-4 h-4 shrink-0" />
                           <span>{item.name}</span>
                        </Link>
                     </li>
                  )
               })}
            </ul>
         </nav>
         <div className="p-4 border-t border-slate-800 shrink-0">
            <div className="bg-slate-800/50 rounded-lg p-3 text-[11px] leading-relaxed mb-4">
               <div className="flex justify-between mb-1">
                  <span className="opacity-70 text-white">Next Cycle</span>
                  <span className="text-orange-400 font-bold tracking-wider">12:00 PM EST</span>
               </div>
               <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[65%]"></div>
               </div>
               <div className="mt-2 flex justify-between uppercase font-semibold text-[9px] tracking-widest">
                  <span>Running: Collector v2.4</span>
                  <span className="text-green-400">Live</span>
               </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
               <div className="truncate text-slate-400" title={userData?.email}>{userData?.email}</div>
               <button onClick={logout} className="text-slate-400 hover:text-white font-bold ml-2">OUT</button>
            </div>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
         <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <h1 className="text-xl font-bold flex items-center gap-2 text-[#1E293B]">
               <span className="w-2 h-6 bg-orange-500 rounded-sm"></span>
               Acquisition Dashboard
            </h1>
            <div className="flex items-center gap-6">
               <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <div className="flex flex-col items-end">
                     <span className="text-[10px] opacity-60">Scan Health</span>
                     <span className="text-green-600">99.2% Success</span>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[10px] opacity-60">System Mode</span>
                     <span className="text-[#0F172A]">Production</span>
                  </div>
               </div>
               <div className="h-8 w-px bg-slate-200"></div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-[#1E293B]">
                     {userData?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
               </div>
            </div>
         </header>
         <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC]">
            {children}
         </div>
      </main>
    </div>
  );
}