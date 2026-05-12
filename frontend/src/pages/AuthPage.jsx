import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const { login, signup }     = useAuth();
  const navigate              = useNavigate();

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: null }));
  };

  function validate() {
    const errs = {};
    if (!isLogin && !form.name.trim()) errs.name = 'Name is required';
    if (!form.email)                   errs.email = 'Email is required';
    if (form.password.length < 6)      errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await signup({ name: form.name, email: form.email, password: form.password, role: form.role });
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error
        || err.response?.data?.details?.[0]?.message
        || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-400 flex items-center justify-center text-xl">⚡</div>
          <span className="font-display text-2xl font-bold text-gray-100">TaskFlow</span>
        </div>

        <div className="card p-8">
          <h2 className="font-display text-xl mb-1 text-gray-100">
            {isLogin ? 'Sign in' : 'Create account'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {isLogin ? 'Demo: admin@taskflow.dev / admin123' : 'Fill in your details to get started'}
          </p>

          <form onSubmit={submit} noValidate className="space-y-4">
            {!isLogin && (
              <div className="field">
                <label>Full name</label>
                <input value={form.name} onChange={set('name')} placeholder="Your name" autoFocus />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
            )}

            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="field">
                <label>Role</label>
                <select value={form.role} onChange={set('role')}>
                  <option value="MEMBER">Member — manage own tasks</option>
                  <option value="ADMIN">Admin — full control</option>
                </select>
                <div className={`mt-2 text-xs px-3 py-2 rounded-lg font-medium
                  ${form.role === 'ADMIN'
                    ? 'bg-brand-400/10 text-brand-400'
                    : 'bg-blue-500/10 text-blue-400'}`}>
                  {form.role === 'ADMIN'
                    ? '⚡ Will be registered as Admin'
                    : '👤 Will be registered as Member'}
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn btn-primary w-full justify-center py-2.5 text-sm mt-2">
              {loading
                ? <span className="spinner" />
                : isLogin
                  ? 'Sign in →'
                  : `Create ${form.role === 'ADMIN' ? 'Admin' : 'Member'} account →`}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            {isLogin ? (
              <>Don't have an account?{' '}
                <Link to="/signup" className="text-brand-400 hover:text-brand-200">Sign up</Link>
              </>
            ) : (
              <>Already have an account?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-200">Sign in</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
