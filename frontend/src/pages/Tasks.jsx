import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { tasksApi, projectsApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import { isPast, format } from 'date-fns';
<<<<<<< HEAD
import { Plus, Search, RotateCcw, Pencil, Trash2, CheckSquare } from 'lucide-react';

const S_CYCLE = { TODO:'IN_PROGRESS', IN_PROGRESS:'DONE', DONE:'TODO' };
const S_LABEL = { TODO:'To Do', IN_PROGRESS:'In Progress', DONE:'Done' };
const S_CLS   = { TODO:'pill-todo', IN_PROGRESS:'pill-inprog', DONE:'pill-done' };
const P_CLS   = { HIGH:'pill-high', MEDIUM:'pill-medium', LOW:'pill-low' };
const P_LABEL = { HIGH:'High', MEDIUM:'Medium', LOW:'Low' };

const AV_GRADS = ['from-violet-500 to-purple-700','from-emerald-400 to-teal-600','from-amber-400 to-orange-600','from-sky-400 to-blue-600','from-pink-400 to-rose-600'];
function avGrad(id=''){let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))%AV_GRADS.length;return AV_GRADS[h];}
function ini(n=''){return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();}

function StatusPill({ status, dueDate }) {
  const over = dueDate && isPast(new Date(dueDate)) && status !== 'DONE';
  if (over) return <span className="pill pill-overdue">Overdue</span>;
  return <span className={`pill ${S_CLS[status]||'pill-todo'}`}>{S_LABEL[status]||status}</span>;
}

function SkeletonRow() {
  return (
    <tr>
      {['60%','40%','50%','25%','30%','20%','15%'].map((w,i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="skel h-3 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

const BLANK = { title:'', description:'', projectId:'', assigneeId:'', status:'TODO', priority:'MEDIUM', dueDate:'' };

const FilterSelect = ({ value, onChange, children }) => (
  <select value={value} onChange={onChange}
    className="text-[12px] px-3 py-2 rounded-xl outline-none transition-all cursor-pointer"
    style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color: value ? '#e2e8f0' : 'rgba(255,255,255,0.3)' }}>
    {children}
  </select>
);

=======

const STATUS_CYCLE  = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' };
const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
const STATUS_CLS    = { TODO: 'pill-todo', IN_PROGRESS: 'pill-inprog', DONE: 'pill-done' };
const PRI_CLS       = { HIGH: 'pill-high', MEDIUM: 'pill-medium', LOW: 'pill-low' };

const AVATAR_BG = ['bg-brand-400','bg-emerald-500','bg-amber-500','bg-blue-500','bg-pink-500'];
function aColor(id = '') { let h=0; for(const c of id) h=(h*31+c.charCodeAt(0))%AVATAR_BG.length; return AVATAR_BG[h]; }
function initials(n='') { return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }

const BLANK = { title:'', description:'', projectId:'', assigneeId:'', status:'TODO', priority:'MEDIUM', dueDate:'' };

>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
export default function Tasks() {
  const { user, isAdmin } = useAuth();
  const [tasks,   setTasks]   = useState([]);
  const [projs,   setProjs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState({ status:'', priority:'', projectId:'', search:'' });
  const [modal,   setModal]   = useState(false);
  const [edit,    setEdit]    = useState(null);
  const [form,    setForm]    = useState(BLANK);
  const [saving,  setSaving]  = useState(false);
<<<<<<< HEAD
  const [cycling, setCycling] = useState(null);

  const loadTasks = useCallback(() => {
    const p = {};
    if (filter.status==='OVERDUE') p.overdue='true';
    else if (filter.status) p.status=filter.status;
    if (filter.priority)  p.priority=filter.priority;
    if (filter.projectId) p.projectId=filter.projectId;
    if (filter.search)    p.search=filter.search;
    return tasksApi.list(p).then(r => setTasks(r.data.tasks));
=======

  const loadTasks = useCallback(() => {
    const params = {};
    if (filter.status === 'OVERDUE') { params.overdue = 'true'; }
    else if (filter.status) params.status = filter.status;
    if (filter.priority)  params.priority  = filter.priority;
    if (filter.projectId) params.projectId = filter.projectId;
    if (filter.search)    params.search    = filter.search;
    return tasksApi.list(params).then(r => setTasks(r.data.tasks));
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
  }, [filter]);

  useEffect(() => { projectsApi.list().then(r => setProjs(r.data.projects)); }, []);
  useEffect(() => { setLoading(true); loadTasks().finally(() => setLoading(false)); }, [loadTasks]);

<<<<<<< HEAD
  const set  = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const setF = k => e => setFilter(f=>({...f,[k]:e.target.value}));
  const projMembers = form.projectId ? (projs.find(p=>p.id===form.projectId)?.members||[]).map(m=>m.user).filter(Boolean) : [];

  function openNew() { setEdit(null); setForm({...BLANK,projectId:projs[0]?.id||'',assigneeId:user.id}); setModal(true); }
  function openEdit(t) { setEdit(t); setForm({title:t.title,description:t.description||'',projectId:t.projectId,assigneeId:t.assigneeId||'',status:t.status,priority:t.priority,dueDate:t.dueDate?t.dueDate.slice(0,10):''}); setModal(true); }

  async function save() {
    if (!form.title.trim()||!form.projectId) { toast.error('Title and project required'); return; }
    setSaving(true);
    try {
      const payload = {...form,dueDate:form.dueDate||undefined,assigneeId:form.assigneeId||undefined};
      if (edit) { await tasksApi.update(edit.id,payload); toast.success('Task updated!'); }
      else       { await tasksApi.create(form.projectId,payload); toast.success('Task created!'); }
      setModal(false); loadTasks();
    } catch (err) { toast.error(err.response?.data?.error||'Failed'); }
=======
  const set  = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setF = k => e => setFilter(f => ({ ...f, [k]: e.target.value }));

  const projMembers = form.projectId
    ? (projs.find(p => p.id === form.projectId)?.members || []).map(m => m.user).filter(Boolean)
    : [];

  function openNew() {
    setEdit(null);
    setForm({ ...BLANK, projectId: projs[0]?.id || '', assigneeId: user.id });
    setModal(true);
  }
  function openEdit(t) {
    setEdit(t);
    setForm({
      title: t.title, description: t.description || '',
      projectId: t.projectId, assigneeId: t.assigneeId || '',
      status: t.status, priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
    });
    setModal(true);
  }

  async function save() {
    if (!form.title.trim() || !form.projectId) { toast.error('Title and project required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, dueDate: form.dueDate || undefined, assigneeId: form.assigneeId || undefined };
      if (edit) {
        await tasksApi.update(edit.id, payload);
        toast.success('Task updated!');
      } else {
        await tasksApi.create(form.projectId, payload);
        toast.success('Task created!');
      }
      setModal(false);
      loadTasks();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
    finally { setSaving(false); }
  }

  async function del(id) {
<<<<<<< HEAD
    try { await tasksApi.delete(id); toast.success('Deleted'); setTasks(t=>t.filter(x=>x.id!==id)); }
    catch (err) { toast.error(err.response?.data?.error||'Failed'); }
  }

  async function cycle(t) {
    setCycling(t.id);
    try { const r = await tasksApi.update(t.id,{status:S_CYCLE[t.status]}); setTasks(ts=>ts.map(x=>x.id===t.id?r.data.task:x)); }
    catch { toast.error('Failed'); }
    finally { setCycling(null); }
  }

  const canEdit = t => isAdmin||t.assigneeId===user.id||t.creatorId===user.id;

  return (
    <div className="space-y-4" style={{ animation: 'fadeUp .3s ease forwards' }}>
      {modal && (
        <Modal title={edit?'Edit task':'New task'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Title</label>
              <input className="inp" value={form.title} onChange={set('title')} placeholder="What needs to be done?" autoFocus />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Description</label>
              <textarea className="inp resize-none" style={{ minHeight: 72 }} value={form.description} onChange={set('description')} placeholder="Optional details…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Project</label>
                <select className="inp" value={form.projectId} onChange={e=>{setForm(f=>({...f,projectId:e.target.value,assigneeId:''}));}}>
                  <option value="">Select…</option>
                  {projs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Assignee</label>
                <select className="inp" value={form.assigneeId} onChange={set('assigneeId')}>
                  <option value="">Unassigned</option>
                  {projMembers.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Status</label>
                <select className="inp" value={form.status} onChange={set('status')}>
=======
    try { await tasksApi.delete(id); toast.success('Deleted'); setTasks(t => t.filter(x => x.id !== id)); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  }

  async function cycle(t) {
    try {
      const res = await tasksApi.update(t.id, { status: STATUS_CYCLE[t.status] });
      setTasks(ts => ts.map(x => x.id === t.id ? res.data.task : x));
    } catch { toast.error('Failed'); }
  }

  const canEdit = t => isAdmin || t.assigneeId === user.id || t.creatorId === user.id;

  return (
    <div className="max-w-6xl space-y-5">
      {modal && (
        <Modal title={edit ? 'Edit Task' : 'New Task'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="field"><label>Title</label><input value={form.title} onChange={set('title')} placeholder="Task title…" autoFocus /></div>
            <div className="field"><label>Description</label><textarea value={form.description} onChange={set('description')} placeholder="Optional details…" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="field">
                <label>Project</label>
                <select value={form.projectId} onChange={e => { setForm(f => ({ ...f, projectId: e.target.value, assigneeId: '' })); }}>
                  <option value="">Select project</option>
                  {projs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Assignee</label>
                <select value={form.assigneeId} onChange={set('assigneeId')}>
                  <option value="">Unassigned</option>
                  {projMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="field">
                <label>Status</label>
                <select value={form.status} onChange={set('status')}>
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
<<<<<<< HEAD
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Priority</label>
                <select className="inp" value={form.priority} onChange={set('priority')}>
=======
              <div className="field">
                <label>Priority</label>
                <select value={form.priority} onChange={set('priority')}>
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
<<<<<<< HEAD
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Due date</label>
                <input type="date" className="inp" style={{ colorScheme: 'dark' }} value={form.dueDate} onChange={set('dueDate')} />
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
              <button onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={save} disabled={saving} className="btn-grad flex-1">
                {saving ? <><span className="spinner"/><span>{edit?'Saving…':'Creating…'}</span></> : <span>{edit?'Save changes':'Create task'}</span>}
=======
            </div>
            <div className="field">
              <label>Due date</label>
              <input type="date" value={form.dueDate} onChange={set('dueDate')} className="[color-scheme:dark]" />
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-800">
              <button onClick={() => setModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={save} disabled={saving} className="btn btn-primary">
                {saving ? <span className="spinner" /> : edit ? 'Save Changes' : 'Create Task'}
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
              </button>
            </div>
          </div>
        </Modal>
      )}

<<<<<<< HEAD
      {/* Filter bar */}
      <div className="glass rounded-2xl p-3 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[160px]">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input className="inp pl-9 py-2 text-[12px]" placeholder="Search tasks…" value={filter.search} onChange={setF('search')} />
        </div>
        <FilterSelect value={filter.status} onChange={setF('status')}>
          <option value="">All status</option>
=======
      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[160px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-brand-400"
            placeholder="Search tasks…" value={filter.search} onChange={setF('search')} />
        </div>
        <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none focus:border-brand-400"
          value={filter.status} onChange={setF('status')}>
          <option value="">All Status</option>
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="OVERDUE">Overdue</option>
<<<<<<< HEAD
        </FilterSelect>
        <FilterSelect value={filter.priority} onChange={setF('priority')}>
          <option value="">All priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </FilterSelect>
        <FilterSelect value={filter.projectId} onChange={setF('projectId')}>
          <option value="">All projects</option>
          {projs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
        </FilterSelect>
        <button onClick={openNew} className="btn-grad btn-sm gap-1.5 whitespace-nowrap">
          <Plus size={13} /><span>New task</span>
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                {['Task','Project','Assignee','Priority','Status','Due',''].map((h,i) => (
                  <th key={i} className="text-left px-4 py-3 text-[10px] font-semibold text-white/25 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [1,2,3,4,5].map(i => <SkeletonRow key={i} />)
                : tasks.length === 0
                  ? (
                    <tr><td colSpan={7}>
                      <div className="py-16 text-center">
                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center mx-auto mb-3">
                          <CheckSquare size={20} className="text-white/20" />
                        </div>
                        <p className="text-[13px] text-white/25 mb-1">No tasks found</p>
                        <p className="text-[11px] text-white/15">Try adjusting your filters</p>
                      </div>
                    </td></tr>
                  )
                  : tasks.map(t => {
                    const over = t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'DONE';
                    return (
                      <tr key={t.id}
                        className="group transition-colors duration-150"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: over ? 'rgba(239,68,68,0.03)' : 'transparent',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = over ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = over ? 'rgba(239,68,68,0.03)' : 'transparent'}
                      >
                        <td className="px-4 py-3.5 max-w-[180px]">
                          <span className="text-white/80 truncate block">{t.title}</span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="flex items-center gap-1.5 text-white/40">
                            <span className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: t.project?.color||'#555', boxShadow:`0 0 4px ${t.project?.color||'#555'}60` }} />
                            {t.project?.name}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {t.assignee ? (
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${avGrad(t.assignee.id)} flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0`}>
                                {ini(t.assignee.name)}
                              </div>
                              <span className="text-white/50">{t.assignee.name}</span>
                            </div>
                          ) : <span className="text-white/20">—</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`pill ${P_CLS[t.priority]||'pill-todo'}`}>{P_LABEL[t.priority]||t.priority}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusPill status={t.status} dueDate={t.dueDate} />
                        </td>
                        <td className={`px-4 py-3.5 whitespace-nowrap font-medium ${over ? 'text-red-400' : 'text-white/30'}`}
                          style={over ? { textShadow: '0 0 8px rgba(239,68,68,0.4)' } : {}}>
                          {t.dueDate ? format(new Date(t.dueDate), 'MMM d') : '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => cycle(t)} disabled={cycling===t.id}
                              className="btn-icon" title="Cycle status">
                              {cycling===t.id ? <span className="spinner" style={{width:11,height:11}} /> : <RotateCcw size={12} />}
                            </button>
                            {canEdit(t) && <button onClick={() => openEdit(t)} className="btn-icon"><Pencil size={12} /></button>}
                            {isAdmin && <button onClick={() => del(t.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={12} /></button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
=======
        </select>
        <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none focus:border-brand-400"
          value={filter.priority} onChange={setF('priority')}>
          <option value="">All Priority</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none focus:border-brand-400"
          value={filter.projectId} onChange={setF('projectId')}>
          <option value="">All Projects</option>
          {projs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button onClick={openNew} className="btn btn-primary btn-sm">+ New Task</button>
      </div>

      {/* Table */}
      {loading
        ? <div className="flex justify-center pt-16"><span className="spinner scale-150" /></div>
        : tasks.length === 0
          ? <div className="card p-12 text-center text-gray-600"><p className="text-3xl mb-3">✅</p><p>No tasks match your filters</p></div>
          : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      {['Task','Project','Assignee','Priority','Status','Due','Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(t => {
                      const over = t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'DONE';
                      return (
                        <tr key={t.id} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors">
                          <td className="px-4 py-3 max-w-[200px]">
                            <span className="text-gray-200 truncate block">{t.title}</span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="flex items-center gap-2 text-gray-400">
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.project?.color || '#888' }} />
                              {t.project?.name}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {t.assignee
                              ? <span className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${aColor(t.assignee.id)}`}>{initials(t.assignee.name)}</div>
                                  <span className="text-gray-300 text-xs">{t.assignee.name}</span>
                                </span>
                              : <span className="text-gray-600">—</span>
                            }
                          </td>
                          <td className="px-4 py-3">
                            <span className={`pill ${PRI_CLS[t.priority] || 'pill-todo'}`}>
                              {t.priority.charAt(0) + t.priority.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {over
                              ? <span className="pill pill-overdue">Overdue</span>
                              : <span className={`pill ${STATUS_CLS[t.status] || 'pill-todo'}`}>{STATUS_LABELS[t.status]}</span>
                            }
                          </td>
                          <td className={`px-4 py-3 text-xs whitespace-nowrap ${over ? 'text-red-400' : 'text-gray-500'}`}>
                            {t.dueDate ? format(new Date(t.dueDate), 'MMM d') : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button onClick={() => cycle(t)} className="btn btn-ghost btn-sm" title="Cycle status">→</button>
                              {canEdit(t) && <button onClick={() => openEdit(t)} className="btn btn-ghost btn-sm">Edit</button>}
                              {isAdmin    && <button onClick={() => del(t.id)}   className="btn btn-danger btn-sm">Del</button>}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
      }
>>>>>>> de827203aca71338eef4788aa9d8ef07728a1c90
    </div>
  );
}
