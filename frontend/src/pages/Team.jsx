import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { usersApi, authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';

const AVATAR_BG = ['bg-brand-400','bg-emerald-500','bg-amber-500','bg-blue-500','bg-pink-500'];
function aColor(id='') { let h=0; for(const c of id) h=(h*31+c.charCodeAt(0))%AVATAR_BG.length; return AVATAR_BG[h]; }
function initials(n='') { return n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }

export default function Team() {
  const { user, isAdmin }    = useAuth();
  const [users, setUsers]    = useState([]);
  const [loading, setLoading]= useState(true);
  const [modal, setModal]    = useState(false);
  const [form, setForm]      = useState({ name:'', email:'', password:'Welcome123', role:'MEMBER' });
  const [saving, setSaving]  = useState(false);

  const load = useCallback(() =>
    usersApi.list().then(r => setUsers(r.data.users)).finally(() => setLoading(false))
  , []);

  useEffect(() => { load(); }, [load]);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function invite() {
    if (!form.name || !form.email) { toast.error('Name and email required'); return; }
    setSaving(true);
    try {
      await authApi.signup(form);
      toast.success(`${form.name} added!`);
      setModal(false);
      setForm({ name:'', email:'', password:'Welcome123', role:'MEMBER' });
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  }

  async function changeRole(uid, current) {
    try {
      await usersApi.updateRole(uid, current === 'ADMIN' ? 'MEMBER' : 'ADMIN');
      toast.success('Role updated');
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  }

  async function removeUser(uid, name) {
    if (!window.confirm(`Remove ${name} from the team?`)) return;
    try { await usersApi.delete(uid); toast.success('Removed'); setUsers(u => u.filter(x => x.id !== uid)); }
    catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
  }

  if (loading) return <div className="flex justify-center pt-16"><span className="spinner scale-150" /></div>;

  return (
    <div className="max-w-5xl space-y-5">
      {modal && (
        <Modal title="Add Team Member" onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="field"><label>Full name</label><input value={form.name} onChange={set('name')} placeholder="Member name" autoFocus /></div>
            <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set('email')} placeholder="email@company.com" /></div>
            <div className="field"><label>Temporary password</label><input value={form.password} onChange={set('password')} /></div>
            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={set('role')}>
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-2 border-t border-gray-800">
              <button onClick={() => setModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={invite} disabled={saving} className="btn btn-primary">
                {saving ? <span className="spinner" /> : 'Add Member'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="flex justify-end">
        {isAdmin && <button onClick={() => setModal(true)} className="btn btn-primary">+ Add Member</button>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(m => {
          const taskCount = m._count?.assignedTasks ?? 0;
          const isYou     = m.id === user.id;
          return (
            <div key={m.id} className="card p-5 flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white mb-3 ${aColor(m.id)}`}>
                {initials(m.name)}
              </div>
              <p className="font-display text-sm font-semibold text-gray-200 mb-0.5">{m.name}</p>
              <p className="text-xs text-gray-500 mb-2">{m.email}</p>
              <span className={`pill ${m.role === 'ADMIN' ? 'pill-admin' : 'pill-member'}`}>{m.role}</span>
              <p className="text-xs text-gray-600 mt-2">{taskCount} task{taskCount !== 1 ? 's' : ''} assigned</p>
              {isYou && <p className="text-xs text-gray-700 mt-1 italic">You</p>}

              {isAdmin && !isYou && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => changeRole(m.id, m.role)} className="btn btn-ghost btn-sm">
                    {m.role === 'ADMIN' ? 'Demote' : 'Make Admin'}
                  </button>
                  <button onClick={() => removeUser(m.id, m.name)} className="btn btn-danger btn-sm">Remove</button>
                </div>
              )}
            </div>
          );
        })}

        {isAdmin && (
          <button onClick={() => setModal(true)}
            className="card p-5 border-dashed flex flex-col items-center justify-center min-h-[200px]
                       text-gray-600 hover:text-gray-400 hover:border-gray-700 transition-colors">
            <span className="text-3xl mb-2">+</span>
            <span className="text-sm">Add Member</span>
          </button>
        )}
      </div>
    </div>
  );
}
