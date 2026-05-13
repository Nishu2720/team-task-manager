import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { usersApi, authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import { Plus, AlertCircle, Shield, UserMinus, Zap } from 'lucide-react';

const AV_GRADS = [
  ['#7c3aed','#4f46e5'], ['#059669','#0891b2'], ['#d97706','#ef4444'],
  ['#2563eb','#0891b2'], ['#db2777','#7c3aed'],
];
function avGrad(id=''){let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))%AV_GRADS.length;return AV_GRADS[h];}
function ini(n=''){return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();}

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col items-center gap-3">
      <div className="skel w-14 h-14 rounded-full" />
      <div className="skel h-4 w-28 rounded" />
      <div className="skel h-3 w-36 rounded" />
      <div className="skel h-6 w-16 rounded-lg" />
    </div>
  );
}

export default function Team() {
  const { user, isAdmin } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState({ name:'', email:'', password:'Welcome123!', role:'MEMBER' });
  const [saving,  setSaving]  = useState(false);
  const [formErr, setFormErr] = useState('');

  const load = useCallback(() => usersApi.list().then(r => setUsers(r.data.users)).finally(() => setLoading(false)), []);
  useEffect(() => { load(); }, [load]);
  const set = k => e => { setForm(f=>({...f,[k]:e.target.value})); setFormErr(''); };

  async function invite() {
    if (!form.name.trim()) { setFormErr('Name is required'); return; }
    if (!form.email.trim()||!/\S+@\S+\.\S+/.test(form.email)) { setFormErr('Enter a valid email'); return; }
    setSaving(true); setFormErr('');
    try {
      await authApi.signup(form);
      toast.success(`${form.name} added to team`);
      setModal(false); setForm({name:'',email:'',password:'Welcome123!',role:'MEMBER'}); load();
    } catch (err) {
      const s = err?.response?.status;
      if (!err?.response) setFormErr('Cannot connect to server.');
      else if (s===409) setFormErr('Email already registered.');
      else setFormErr(err?.response?.data?.error||'Failed to add member');
    } finally { setSaving(false); }
  }

  async function changeRole(uid, current) {
    const nr = current==='ADMIN'?'MEMBER':'ADMIN';
    try { await usersApi.updateRole(uid,nr); toast.success('Role updated'); load(); }
    catch (err) { toast.error(err.response?.data?.error||'Failed'); }
  }

  async function removeUser(uid, name) {
    if (!window.confirm(`Remove ${name} from the team?`)) return;
    try { await usersApi.delete(uid); toast.success(`${name} removed`); setUsers(u=>u.filter(x=>x.id!==uid)); }
    catch (err) { toast.error(err.response?.data?.error||'Failed'); }
  }

  return (
    <div className="max-w-4xl space-y-5" style={{ animation: 'fadeUp .3s ease forwards' }}>
      {modal && (
        <Modal title="Add team member" onClose={() => { setModal(false); setFormErr(''); }}>
          <div className="space-y-4">
            {[['Full name','name','text','Alex Rivera'],['Email','email','email','alex@company.com'],['Temp password','password','text','']].map(([lbl,key,type,ph]) => (
              <div key={key}>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{lbl}</label>
                <input className="inp" type={type} value={form[key]} onChange={set(key)} placeholder={ph} />
              </div>
            ))}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Role</label>
              <div className="grid grid-cols-2 gap-2">
                {['MEMBER','ADMIN'].map(r => (
                  <button key={r} type="button" onClick={() => setForm(f=>({...f,role:r}))}
                    className={`py-3 rounded-xl border text-[12px] font-semibold transition-all duration-200
                      ${form.role===r
                        ? r==='ADMIN' ? 'text-violet-300 border-violet-500/50' : 'text-blue-300 border-blue-500/50'
                        : 'text-white/30 border-white/10 hover:border-white/20'}`}
                    style={form.role===r ? {
                      background: r==='ADMIN' ? 'rgba(124,58,237,0.15)' : 'rgba(37,99,235,0.15)',
                      boxShadow: r==='ADMIN' ? '0 0 20px rgba(124,58,237,0.15)' : '0 0 20px rgba(37,99,235,0.15)',
                    } : {}}>
                    {r==='ADMIN' ? '⚡ Admin' : '👤 Member'}
                  </button>
                ))}
              </div>
            </div>
            {formErr && (
              <div className="flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-[12px]"
                style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#f87171' }}>
                <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />{formErr}
              </div>
            )}
            <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
              <button onClick={() => setModal(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={invite} disabled={saving} className="btn-grad flex-1">
                {saving ? <><span className="spinner"/><span>Adding…</span></> : <><span>Add member</span><Plus size={14}/></>}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-white/25">
          {loading ? '' : `${users.length} member${users.length!==1?'s':''}`}
        </p>
        {isAdmin && (
          <button onClick={() => setModal(true)} className="btn-grad">
            <Plus size={14} /><span>Add member</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? [1,2,3,4].map(i => <SkeletonCard key={i} />)
          : users.map(m => {
            const [c1, c2] = avGrad(m.id);
            const count = m._count?.assignedTasks ?? 0;
            const isYou = m.id === user.id;
            return (
              <div key={m.id} className="glass glass-hover rounded-2xl p-5 flex flex-col items-center text-center gap-3 group glow-border">
                {/* Avatar with gradient ring */}
                <div className="av-ring">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, boxShadow: `0 0 20px ${c1}40` }}>
                    {ini(m.name)}
                  </div>
                </div>

                <div>
                  <p className="font-display text-[13px] font-semibold text-white leading-tight">{m.name}</p>
                  <p className="text-[11px] text-white/25 mt-0.5 break-all">{m.email}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`pill ${m.role==='ADMIN'?'pill-admin':'pill-member'}`}>
                    {m.role==='ADMIN' && <Zap size={9} />}
                    {m.role}
                  </span>
                  {isYou && <span className="text-[9px] text-white/25 italic">you</span>}
                </div>

                <p className="text-[11px] text-white/25">{count} task{count!==1?'s':''} assigned</p>

                {isAdmin && !isYou && (
                  <div className="flex gap-2 w-full mt-1">
                    <button onClick={() => changeRole(m.id, m.role)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium text-white/40 border border-white/10 hover:text-white/70 hover:border-white/20 transition-all">
                      <Shield size={11} />
                      {m.role==='ADMIN' ? 'Demote' : 'Promote'}
                    </button>
                    <button onClick={() => removeUser(m.id, m.name)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.06] transition-all">
                      <UserMinus size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        }

        {!loading && isAdmin && (
          <button onClick={() => setModal(true)}
            className="glass rounded-2xl p-5 border-dashed flex flex-col items-center justify-center min-h-[200px] gap-3 text-white/20 hover:text-white/40 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-xl border border-dashed border-current flex items-center justify-center group-hover:border-violet-500/50 group-hover:text-violet-400 transition-all">
              <Plus size={16} />
            </div>
            <span className="text-[12px] font-medium">Add member</span>
          </button>
        )}
      </div>
    </div>
  );
}
