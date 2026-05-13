import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { projectsApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
<<<<<<< HEAD
import { Plus, UserPlus, Trash2, Folder, AlertCircle, Users } from 'lucide-react';

const PALETTE = ['#7c3aed','#2563eb','#db2777','#059669','#d97706','#0891b2','#7c3aed','#dc2626'];
const AV_GRADS = ['from-violet-500 to-purple-700','from-emerald-400 to-teal-600','from-amber-400 to-orange-600','from-sky-400 to-blue-600','from-pink-400 to-rose-600'];
function avGrad(id=''){let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))%AV_GRADS.length;return AV_GRADS[h];}
function ini(n=''){return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2.5"><div className="skel w-3 h-3 rounded-full" /><div className="skel h-4 w-32 rounded" /></div>
      <div className="skel h-3 w-full rounded" /><div className="skel h-3 w-2/3 rounded" />
      <div className="skel h-1.5 w-full rounded-full mt-2" />
    </div>
  );
}

function AddMemberModal({ project, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setLoading(true); setError('');
    try {
      await projectsApi.addMember(project.id, email.trim());
      toast.success('Member added!');
      onSuccess(); onClose();
    } catch (err) {
      const s = err?.response?.status;
      if (!err?.response) setError('Cannot connect to server.');
      else if (s === 404) setError('No account found with this email.');
      else if (s === 409) setError('Already a project member.');
      else setError(err?.response?.data?.error || 'Failed to add member.');
    } finally { setLoading(false); }
  }

  return (
    <Modal title={`Add member — ${project.name}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Member email</label>
          <input className={`inp ${error ? 'inp-error' : ''}`} type="email" value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="colleague@company.com" autoFocus />
          {error && (
            <div className="flex items-start gap-2.5 mt-2.5 rounded-xl px-3.5 py-2.5 text-[12px]"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
              <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          <p className="text-[11px] text-white/20 mt-2">Person must already have a TaskFlow account.</p>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-grad flex-1">
            {loading ? <><span className="spinner" /><span>Adding…</span></> : <><span>Add member</span><UserPlus size={14} /></>}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteModal({ project, onClose, onConfirm, loading }) {
  return (
    <Modal title="Delete project" onClose={onClose}>
      <div className="space-y-5">
        <p className="text-[13px] text-white/50 leading-relaxed">
          Delete <span className="text-white font-semibold">"{project.name}"</span>? All tasks inside will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 border border-red-500/30 transition-all hover:bg-red-500/15 disabled:opacity-40">
            {loading ? <><span className="spinner" /><span>Deleting…</span></> : <><Trash2 size={14} /><span>Delete</span></>}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreate] = useState(false);
  const [addMember, setAddMember] = useState(null);
  const [deleteProj, setDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: PALETTE[0] });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');

  const load = useCallback(() => projectsApi.list().then(r => setProjs(r.data.projects)).finally(() => setLoading(false)), []);
  useEffect(() => { load(); }, [load]);
  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setFormErr(''); };

  async function create() {
    if (!form.name.trim()) { setFormErr('Project name is required'); return; }
    setSaving(true); setFormErr('');
    try {
      await projectsApi.create(form);
      toast.success('Project created!');
      setCreate(false); setForm({ name: '', description: '', color: PALETTE[0] }); load();
    } catch (err) { setFormErr(err?.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  }

  async function confirmDelete() {
    setDeleting(true);
    try { await projectsApi.delete(deleteProj.id); toast.success('Deleted'); setDelete(null); load(); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  }

  return (
    <div className="max-w-5xl space-y-5" style={{ animation: 'fadeUp .3s ease forwards' }}>
      {createOpen && (
        <Modal title="New project" onClose={() => setCreate(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Project name</label>
              <input className={`inp ${formErr ? 'inp-error' : ''}`} value={form.name} onChange={set('name')} placeholder="e.g. Website Redesign" autoFocus />
              {formErr && (
                <div className="flex items-center gap-2 mt-2 text-[12px] text-red-400">
                  <AlertCircle size={12} />{formErr}
                </div>
              )}
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Description</label>
              <textarea className="inp resize-none" style={{ minHeight: 80 }} value={form.description} onChange={set('description')} placeholder="What's this project about?" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Color</label>
              <div className="flex gap-2.5 flex-wrap">
                {PALETTE.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                    className="w-7 h-7 rounded-full transition-all duration-150"
                    style={{ background: c, outline: form.color === c ? `3px solid ${c}` : 'none', outlineOffset: 3, boxShadow: form.color === c ? `0 0 12px ${c}60` : 'none' }} />
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
              <button onClick={() => setCreate(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={create} disabled={saving} className="btn-grad flex-1">
                {saving ? <><span className="spinner" /><span>Creating…</span></> : <><span>Create project</span><Plus size={14} /></>}
=======

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
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
              </button>
            </div>
          </div>
        </Modal>
      )}
<<<<<<< HEAD
      {addMember && <AddMemberModal project={addMember} onClose={() => setAddMember(null)} onSuccess={load} />}
      {deleteProj && <DeleteModal project={deleteProj} onClose={() => setDelete(null)} onConfirm={confirmDelete} loading={deleting} />}

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-white/25">
          {loading ? '' : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
        </p>
        {isAdmin && (
          <button onClick={() => setCreate(true)} className="btn-grad">
            <Plus size={14} /><span>New project</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Folder size={24} className="text-white/20" />
          </div>
          <p className="font-display text-[15px] font-semibold text-white/40 mb-1">No projects yet</p>
          <p className="text-[12px] text-white/20 mb-5">Create your first project to start tracking tasks</p>
          {isAdmin && <button onClick={() => setCreate(true)} className="btn-grad mx-auto"><Plus size={14} /><span>Create project</span></button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(proj => {
            const total = (proj.taskStats?.TODO??0)+(proj.taskStats?.IN_PROGRESS??0)+(proj.taskStats?.DONE??0);
            const done  = proj.taskStats?.DONE??0;
            const pct   = total ? Math.round(done/total*100) : 0;
            const members = proj.members || [];
            return (
              <div key={proj.id} className="glass glass-hover rounded-2xl p-5 group glow-border flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: proj.color, boxShadow: `0 0 8px ${proj.color}80` }} />
                    <h3 className="font-display text-[14px] font-semibold text-white truncate">{proj.name}</h3>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setAddMember(proj)} className="btn-icon" title="Add member"><UserPlus size={13} /></button>
                      <button onClick={() => setDelete(proj)} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete"><Trash2 size={13} /></button>
                    </div>
                  )}
                </div>

                <p className="text-[12px] text-white/35 leading-relaxed line-clamp-2 min-h-[36px]">
                  {proj.description || 'No description.'}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {members.slice(0, 4).map((m, i) => (
                      <div key={m.id||i} title={m.user?.name}
                        className="w-6 h-6 rounded-full border-2 border-[#020209] flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${PALETTE[i%PALETTE.length]}, ${PALETTE[(i+2)%PALETTE.length]})` }}>
                        {ini(m.user?.name||'?')}
                      </div>
                    ))}
                    {members.length > 4 && (
                      <div className="w-6 h-6 rounded-full border-2 border-[#020209] flex items-center justify-center text-[8px] text-white/40" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        +{members.length-4}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-white/25 flex items-center gap-1">
                    <Users size={11} />{total}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-2 text-white/30">
                    <span>Progress</span>
                    <span className={pct===100?'text-emerald-400':''} style={pct===100?{textShadow:'0 0 8px #34d399'}:{}}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${pct}%`, background: pct===100 ? 'linear-gradient(90deg,#10b981,#34d399)' : `linear-gradient(90deg,${proj.color},${proj.color}99)`, boxShadow: `0 0 8px ${proj.color}50` }} />
                  </div>
                </div>
              </div>
            );
          })}

          {isAdmin && (
            <button onClick={() => setCreate(true)}
              className="glass rounded-2xl p-5 border-dashed flex flex-col items-center justify-center min-h-[200px] gap-3 text-white/20 hover:text-white/40 hover:border-white/20 transition-all duration-200 group">
              <div className="w-10 h-10 rounded-xl border border-dashed border-current flex items-center justify-center group-hover:border-violet-500/50 group-hover:text-violet-400 transition-all">
                <Plus size={16} />
              </div>
              <span className="text-[12px] font-medium">New project</span>
            </button>
          )}
        </div>
      )}
=======

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
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
    </div>
  );
}
