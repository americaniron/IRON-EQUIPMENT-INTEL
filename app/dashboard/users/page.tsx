'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { Users, Plus } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadUsers() {
      try {
        const snap = await getDocs(query(collection(db, 'users'), limit(20)));
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (!isMounted) return;
        if (docs.length === 0) {
          setUsers([
            { id: 'usr-1', email: 'ahmed@americanironus.com', role: 'SUPER_ADMIN', status: 'ACTIVE', lastActive: 'Just now' },
            { id: 'usr-2', email: 'ops@americanironus.com', role: 'ADMIN', status: 'ACTIVE', lastActive: '2 hours ago' },
            { id: 'usr-3', email: 'acquisitions@americanironus.com', role: 'EDITOR', status: 'ACTIVE', lastActive: 'Yesterday' }
          ]);
        } else {
          setUsers(docs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadUsers();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            <h1 className="text-lg font-bold text-slate-800">User Management & Access Controls</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage organization members, scraper access roles, and permissions.
          </p>
        </div>
        <button 
          onClick={() => alert("Invite user dialog")}
          className="flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-sm text-xs font-bold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Invite Member
        </button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-4 py-2.5">User / Email</th>
              <th className="px-4 py-2.5">Access Role</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Last Active</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading user directory...</td></tr>
            ) : users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-800">{user.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-xs text-[10px] font-extrabold uppercase tracking-wider ${
                    user.role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    user.role === 'ADMIN' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role || 'VIEWER'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-green-600 font-semibold text-xs">● Active</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{user.lastActive || 'Today'}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-slate-400 hover:text-slate-700 font-bold text-xs">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
