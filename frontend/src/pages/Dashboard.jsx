import { useState, useEffect } from 'react';
import { dashboardApi, projectsApi } from '../api';
<<<<<<< HEAD
import { isPast } from 'date-fns';
import { TrendingUp, Clock, CheckCircle2, AlertTriangle, Folder, ArrowUpRight } from 'lucide-react';

function Skel({ className = '' }) { return <div className={`skel ${className}`} />; }

function StatCard({ label, value, icon: Icon, gradient, sub, loading }) {
  if (loading) return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between"><Skel className="h-4 w-24" /><Skel className="h-8 w-8 rounded-xl" /></div>
      <Skel className="h-9 w-16 mt-2" />
      <Skel className="h-3 w-28" />
    </div>
  );
  return (
    <div className="glass glass-hover rounded-2xl p-5 group relative overflow-hidden">
      {/* glow bg */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at top right, ${gradient}15 0%, transparent 70%)` }} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">{label}</span>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${gradient}20`, border: `1px solid ${gradient}30` }}>
            <Icon size={15} style={{ color: gradient }} />
          </div>
        </div>
        <div className="font-display text-4xl font-bold text-white mb-2"
          style={{ textShadow: `0 0 30px ${gradient}40` }}>{value}</div>
        <p className="text-[12px] text-white/30">{sub}</p>
      </div>
    </div>
  );
}

function StatusDot({ status, dueDate }) {
  const over = dueDate && isPast(new Date(dueDate)) && status !== 'DONE';
  if (over) return <span className="pill pill-overdue"><span className="neon-dot" style={{ color: '#f87171' }} />Overdue</span>;
  const map = { TODO: ['pill-todo','To Do'], IN_PROGRESS: ['pill-inprog','In Progress'], DONE: ['pill-done','Done'] };
  const [cls, label] = map[status] || ['pill-todo', status];
  return <span className={`pill ${cls}`}>{label}</span>;
}

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [recent,  setRecent]  = useState([]);
  const [projs,   setProjs]   = useState([]);
=======
import { isPast, format } from 'date-fns';

const STATUS_MAP = {
  TODO:        { label: 'To Do',       cls: 'pill-todo'   },
  IN_PROGRESS: { label: 'In Progress', cls: 'pill-inprog' },
  DONE:        { label: 'Done',        cls: 'pill-done'   },
};

function StatusPill({ status, dueDate }) {
  const over = dueDate && isPast(new Date(dueDate)) && status !== 'DONE';
  if (over) return <span className="pill pill-overdue">Overdue</span>;
  const s = STATUS_MAP[status] || { label: status, cls: 'pill-todo' };
  return <span className={`pill ${s.cls}`}>{s.label}</span>;
}

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [projs, setProjs]   = useState([]);
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.get(), projectsApi.list()])
<<<<<<< HEAD
      .then(([d, p]) => { setStats(d.data.stats); setRecent(d.data.recentTasks); setProjs(p.data.projects); })
      .finally(() => setLoading(false));
  }, []);

  const CARDS = [
    { label: 'Total Tasks',  value: stats?.totalTasks??0,   icon: TrendingUp,    gradient: '#8b5cf6', sub: `${stats?.totalProjects??0} active projects` },
    { label: 'Completed',    value: stats?.done??0,          icon: CheckCircle2,  gradient: '#10b981', sub: `${stats?.totalTasks ? Math.round(stats.done/stats.totalTasks*100) : 0}% completion rate` },
    { label: 'In Progress',  value: stats?.inProgress??0,    icon: Clock,         gradient: '#f59e0b', sub: 'Currently active' },
    { label: 'Overdue',      value: stats?.overdue??0,       icon: AlertTriangle, gradient: stats?.overdue > 0 ? '#ef4444' : '#6b7280', sub: 'Need immediate attention' },
  ];

  return (
    <div className="space-y-6 max-w-5xl" style={{ animation: 'fadeUp .3s ease forwards' }}>
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(c => <StatCard key={c.label} {...c} loading={loading} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent tasks */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-[14px] font-semibold text-white">Recent Tasks</h3>
            <span className="text-[11px] text-white/25 font-medium">Last 5</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skel className="w-2 h-2 rounded-full" />
                  <div className="flex-1 space-y-1.5"><Skel className="h-3 w-3/4" /><Skel className="h-2.5 w-1/3" /></div>
                  <Skel className="h-5 w-16 rounded-lg" />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={20} className="text-white/20" />
              </div>
              <p className="text-[13px] text-white/25">No tasks yet</p>
            </div>
          ) : recent.map(t => (
            <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 group">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'DONE' ? 'bg-red-400' :
                t.status === 'DONE' ? 'bg-emerald-400' : 'bg-violet-400'
              }`} style={{ boxShadow: `0 0 6px currentColor` }} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white/80 truncate group-hover:text-white transition-colors">{t.title}</p>
                <p className="text-[11px] text-white/25">{t.project?.name}</p>
              </div>
              <StatusDot status={t.status} dueDate={t.dueDate} />
            </div>
          ))}
        </div>

        {/* Project progress */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-[14px] font-semibold text-white">Project Progress</h3>
            <Folder size={14} className="text-white/25" />
          </div>
          {loading ? (
            <div className="space-y-5">
              {[1,2,3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between"><Skel className="h-3 w-28" /><Skel className="h-3 w-8" /></div>
                  <Skel className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : projs.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-[13px] text-white/25">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {projs.map(p => {
                const total = (p.taskStats?.TODO??0)+(p.taskStats?.IN_PROGRESS??0)+(p.taskStats?.DONE??0);
                const done  = p.taskStats?.DONE??0;
                const pct   = total ? Math.round(done/total*100) : 0;
                return (
                  <div key={p.id}>
                    <div className="flex justify-between text-[12px] mb-2">
                      <span className="text-white/70 font-medium truncate">{p.name}</span>
                      <span className={`flex-shrink-0 ml-2 font-bold ${pct===100 ? 'text-emerald-400' : 'text-white/40'}`}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-700 ease-out relative"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : `linear-gradient(90deg, ${p.color}, ${p.color}99)`,
                          boxShadow: `0 0 8px ${p.color}60`,
                        }} />
                    </div>
                    <p className="text-[10px] text-white/20 mt-1">{done}/{total} tasks</p>
                  </div>
                );
              })}
            </div>
          )}
=======
      .then(([d, p]) => {
        setStats(d.data.stats);
        setRecent(d.data.recentTasks);
        setProjs(p.data.projects);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center pt-16"><span className="spinner scale-150" /></div>
  );

  const STAT_CARDS = [
    { label: 'Total Tasks',  value: stats?.totalTasks ?? 0, color: 'text-brand-400',   sub: `${stats?.totalProjects ?? 0} projects` },
    { label: 'Completed',    value: stats?.done ?? 0,       color: 'text-emerald-400', sub: `${stats?.totalTasks ? Math.round(stats.done / stats.totalTasks * 100) : 0}% rate` },
    { label: 'In Progress',  value: stats?.inProgress ?? 0, color: 'text-amber-400',   sub: 'Active now' },
    { label: 'Overdue',      value: stats?.overdue ?? 0,    color: 'text-red-400',      sub: 'Need attention' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page title update */}
      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('page-title')&&(document.getElementById('page-title').textContent='Dashboard')` }} />

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="card p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">{s.label}</p>
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Two column panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent tasks */}
        <div className="card p-5">
          <h3 className="font-display text-sm font-semibold text-gray-200 mb-4">Recent Tasks</h3>
          {recent.length === 0
            ? <p className="text-sm text-gray-600 py-6 text-center">No tasks yet</p>
            : <div className="space-y-0.5">
                {recent.map(t => (
                  <div key={t.id} className="flex items-center gap-3 py-2.5 border-b border-gray-800 last:border-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'DONE'
                        ? 'bg-red-400' : t.status === 'DONE' ? 'bg-emerald-400' : 'bg-brand-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">{t.title}</p>
                      <p className="text-xs text-gray-600">{t.project?.name}</p>
                    </div>
                    <StatusPill status={t.status} dueDate={t.dueDate} />
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Project progress */}
        <div className="card p-5">
          <h3 className="font-display text-sm font-semibold text-gray-200 mb-4">Project Progress</h3>
          {projs.length === 0
            ? <p className="text-sm text-gray-600 py-6 text-center">No projects</p>
            : <div className="space-y-4">
                {projs.map(p => {
                  const total = (p.taskStats?.TODO ?? 0) + (p.taskStats?.IN_PROGRESS ?? 0) + (p.taskStats?.DONE ?? 0);
                  const done  = p.taskStats?.DONE ?? 0;
                  const pct   = total ? Math.round(done / total * 100) : 0;
                  return (
                    <div key={p.id}>
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                        <span className="truncate">{p.name}</span>
                        <span className="ml-2 flex-shrink-0">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                             style={{ width: `${pct}%`, background: p.color }} />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{done}/{total} tasks</p>
                    </div>
                  );
                })}
              </div>
          }
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
        </div>
      </div>
    </div>
  );
}
