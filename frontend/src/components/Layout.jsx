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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
