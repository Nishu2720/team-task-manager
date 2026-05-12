import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { projectsApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';

const COLORS = ['#7c6ff7','#34d399','#f59e0b','#60a5fa','#f87171','#e879f9','#2dd4bf','#fb923c'];

const AVATAR_COLORS = ['bg-brand-400','bg-emerald-500','bg-amber-500','bg-blue-500','bg-pink-500'];
function avatarColor(id = '') {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}
function initials(name = '') { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

export default function Projects() {
  const { isAdmin }          = useAuth();
  const [projects, setProjs] = useState([]);
  const [loading, setLoading]= useState(true);
  const [modal, setModal]    = useState(false);
  const [form, setForm]      = useState({ name: '', description: '', color: COLORS[0] });
  const [saving, setSaving]  = useState(false);

  const load = useCallback(() =>
    projectsApi.list().then(r => setProjs(r.data.projects)).finally(() => setLoading(false))
  , []);

  useEffect(() => { load(); }, [load]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function create() {
    if (!form.name.trim()) { toast.error('Project name required'); return; }
    setSaving(true);
    try {
      await projectsApi.create(form);
      toast.success('Project created!');
      setModal(false);
      setForm({ name: '', description: '', color: COLORS[0] });
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  }

  async function del(id) {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try { await projectsApi.delete(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  }

  async function addMember(proj) {
    const email = window.prompt('Enter member email to add:');
    if (!email) return;
    try { await projectsApi.addMember(proj.id, email); toast.success('Member added!'); load(); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  }

  if (loading) return <div className="flex justify-center pt-16"><span className="spinner scale-150" /></div>;

  return (
    <div className="max-w-5xl space-y-5">
      {modal && (
        <Modal title="New Project" onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="field"><label>Project name</label><input value={form.name} onChange={set('name')} placeholder="e.g. Website Redesign" autoFocus /></div>
            <div className="field"><label>Description</label><textarea value={form.description} onChange={set('description')} placeholder="Brief description…" /></div>
            <div className="field">
              <label>Color</label>
              <div className="flex gap-2 mt-1 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    className="w-7 h-7 rounded-full transition-all"
                    style={{ background: c, outline: form.color === c ? `3px solid white` : 'none', outlineOffset: 2 }} />
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-800">
              <button onClick={() => setModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={create} disabled={saving} className="btn btn-primary">
                {saving ? <span className="spinner" /> : 'Create Project'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex justify-end">
        {isAdmin && <button onClick={() => setModal(true)} className="btn btn-primary">+ New Project</button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(proj => {
          const total = (proj.taskStats?.TODO ?? 0) + (proj.taskStats?.IN_PROGRESS ?? 0) + (proj.taskStats?.DONE ?? 0);
          const done  = proj.taskStats?.DONE ?? 0;
          const pct   = total ? Math.round(done / total * 100) : 0;
          const members = proj.members || [];
          return (
            <div key={proj.id} className="card p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: proj.color }} />
                  <h3 className="font-display text-sm font-semibold text-gray-100 truncate">{proj.name}</h3>
                </div>
                {isAdmin && (
                  <div className="flex gap-1.5 ml-2 flex-shrink-0">
                    <button onClick={() => addMember(proj)} className="btn btn-ghost btn-sm px-2">+</button>
                    <button onClick={() => del(proj.id)}    className="btn btn-danger btn-sm px-2">×</button>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-4 min-h-[32px] line-clamp-2">{proj.description || 'No description.'}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex -space-x-2">
                  {members.slice(0, 5).map((m, i) => (
                    <div key={m.id || i} title={m.user?.name}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900 ${avatarColor(m.userId || m.id || '')}`}>
                      {initials(m.user?.name || '?')}
                    </div>
                  ))}
                  {members.length > 5 && (
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 border-2 border-gray-900">
                      +{members.length - 5}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600">{total} tasks</span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span><span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                       style={{ width: `${pct}%`, background: proj.color }} />
                </div>
              </div>
            </div>
          );
        })}

        {isAdmin && (
          <button onClick={() => setModal(true)}
            className="card p-5 border-dashed flex flex-col items-center justify-center min-h-[180px]
                       text-gray-600 hover:text-gray-400 hover:border-gray-700 transition-colors">
            <span className="text-3xl mb-2">+</span>
            <span className="text-sm">New Project</span>
          </button>
        )}
      </div>
    </div>
  );
}
