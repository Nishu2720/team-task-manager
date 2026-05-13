import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  LogOut, Menu, X, Zap
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects',  label: 'Projects',  icon: FolderKanban },
  { to: '/tasks',     label: 'Tasks',     icon: CheckSquare },
  { to: '/team',      label: 'Team',      icon: Users },
];

const AV_GRADS = [
  'from-violet-500 to-purple-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-sky-400 to-blue-600',
  'from-pink-400 to-rose-600',
];
function avGrad(id = '') { let h = 0; for (const c of id) h = (h*31+c.charCodeAt(0)) % AV_GRADS.length; return AV_GRADS[h]; }
function ini(n = '') { return n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

const TITLES = { '/dashboard':'Dashboard', '/projects':'Projects', '/tasks':'Tasks', '/team':'Team' };

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
          <Zap size={14} className="text-white" />
        </div>
        <div>
          <span className="font-display text-[15px] font-bold tracking-tight text-white">TaskFlow</span>
          <div className="text-[9px] text-white/30 font-medium tracking-widest uppercase">Pro</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="text-[9px] font-semibold text-white/20 uppercase tracking-widest px-3 mb-3">Navigation</div>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group
              ${isActive
                ? 'text-white'
                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 w-[3px] h-8 rounded-r-full"
                    style={{ background: 'linear-gradient(to bottom, #7c3aed, #2563eb)' }} />
                )}
                <div className={`
                  w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                  ${isActive
                    ? 'text-white'
                    : 'text-white/30 group-hover:text-white/60'}
                `}
                  style={isActive ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.4))', boxShadow: '0 0 12px rgba(139,92,246,0.3)' } : {}}>
                  <Icon size={14} />
                </div>
                <span>{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
                    style={{ boxShadow: '0 0 6px #8b5cf6' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="glass rounded-xl p-3 flex items-center gap-3">
          <div className={`av-ring flex-shrink-0`}>
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avGrad(user?.id||'')} flex items-center justify-center text-[11px] font-bold text-white`}>
              {ini(user?.name||'')}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-white/30 truncate">{isAdmin ? '⚡ Admin' : '👤 Member'}</p>
          </div>
          <button onClick={logout} title="Sign out"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/25
                       hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 flex-shrink-0">
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#020209' }}>
      {/* Ambient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06] animate-blob"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-[0.05] animate-blob animation-delay-2000"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full opacity-[0.04] animate-blob animation-delay-4000"
          style={{ background: 'radial-gradient(circle, #db2777, transparent)' }} />
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 lg:z-auto w-[210px] flex-shrink-0
        border-r border-white/[0.06] relative
        transition-transform duration-300 lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ background: 'rgba(7,7,15,0.95)', backdropFilter: 'blur(20px)' }}>
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative z-10">
        {/* Topbar */}
        <header className="h-14 flex items-center px-5 gap-4 flex-shrink-0 border-b border-white/[0.06]"
          style={{ background: 'rgba(2,2,9,0.8)', backdropFilter: 'blur(20px)' }}>
          <button className="lg:hidden text-white/40 hover:text-white transition-colors" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-[15px] font-semibold text-white">
              {TITLES[pathname] || 'TaskFlow'}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 glass rounded-xl px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                style={{ boxShadow: '0 0 6px #34d399' }} />
              <span className="text-[11px] text-white/40 font-medium">Live</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
