import { useState, useEffect } from 'react';
import { dashboardApi, projectsApi } from '../api';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.get(), projectsApi.list()])
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
        </div>
      </div>
    </div>
  );
}
