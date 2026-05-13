<<<<<<< HEAD
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
=======
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/projects',  icon: '📁', label: 'Projects'  },
  { to: '/tasks',     icon: '✅', label: 'Tasks'     },
  { to: '/team',      icon: '👥', label: 'Team'      },
];

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ['bg-brand-400','bg-emerald-500','bg-amber-500','bg-blue-500','bg-pink-500'];
function avatarColor(id = '') {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center text-white text-base">⚡</div>
          <span className="font-display text-base font-bold text-gray-100">TaskFlow</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                 ${isActive
                   ? 'bg-brand-400/10 text-brand-400 font-medium'
                   : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`
              }
            >
              <span className="text-base">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${avatarColor(user?.id || '')}`}>
              {initials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`pill ${isAdmin ? 'pill-admin' : 'pill-member'}`}>
              {user?.role}
            </span>
            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-6 flex-shrink-0">
          <h1 className="font-display text-base font-semibold text-gray-100" id="page-title">Dashboard</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
          <Outlet />
        </main>
      </div>
    </div>
  );
}
