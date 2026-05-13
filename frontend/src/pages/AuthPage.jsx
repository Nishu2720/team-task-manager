import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle, Wifi, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function parseAuthError(err) {
  const status = err?.response?.status;
  const msg = err?.response?.data?.error || '';
  if (!err?.response) return { field: 'form', text: 'Cannot connect to server. Check your connection.' };
  if (status === 401) {
    if (msg.toLowerCase().includes('password')) return { field: 'password', text: 'Incorrect password. Try again.' };
    return { field: 'email', text: 'No account found with this email.' };
  }
  if (status === 409) return { field: 'email', text: 'Email already registered. Sign in instead.' };
  if (status === 429) return { field: 'form', text: 'Too many attempts. Wait a few minutes.' };
  if (status >= 500)  return { field: 'form', text: 'Server error. Try again shortly.' };
  return { field: 'form', text: msg || 'Something went wrong.' };
}

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Real-time updates across your team' },
  { icon: '🎯', title: 'Smart Tracking', desc: 'AI-powered task prioritization' },
  { icon: '🔒', title: 'Secure by Default', desc: 'Enterprise-grade security built in' },
];

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(e => ({ ...e, [k]: null, form: null })); };

  function validate() {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setErrors({});
    try {
      if (isLogin) await login(form.email, form.password);
      else await signup({ name: form.name, email: form.email, password: form.password, role: form.role });
      navigate('/dashboard');
    } catch (err) {
      const { field, text } = parseAuthError(err);
      setErrors(prev => ({ ...prev, [field]: text }));
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#020209' }}>
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12">
        {/* animated blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-25 animate-blob"
            style={{ background: 'radial-gradient(circle at center, #7c3aed, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-20 animate-blob animation-delay-2000"
            style={{ background: 'radial-gradient(circle at center, #2563eb, transparent 70%)' }} />
          <div className="absolute top-[45%] right-[10%] w-[300px] h-[300px] rounded-full opacity-15 animate-blob animation-delay-4000"
            style={{ background: 'radial-gradient(circle at center, #db2777, transparent 70%)' }} />
          {/* grid overlay */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 30px rgba(139,92,246,0.4)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <span className="font-display text-xl font-bold text-white">TaskFlow</span>
            <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa' }}>PRO</span>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative">
          <div className="text-[11px] font-semibold tracking-widest uppercase mb-4"
            style={{ color: 'rgba(167,139,250,0.7)' }}>
            ✦ Team productivity, reimagined
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.1] text-white mb-6">
            Ship faster.<br />
            <span className="grad-text">Together.</span>
          </h1>
          <p className="text-[15px] text-white/40 leading-relaxed max-w-sm">
            The all-in-one workspace for high-performing teams. Assign, track, and deliver — beautifully.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative space-y-3">
          {FEATURES.map(f => (
            <div key={f.title} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
              <span className="text-lg">{f.icon}</span>
              <div>
                <p className="text-[13px] font-semibold text-white">{f.title}</p>
                <p className="text-[11px] text-white/35">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* subtle gradient */}
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(139,92,246,0.08) 0%, transparent 60%)' }} />

        <div className="relative w-full max-w-[380px]" style={{ animation: 'fadeUp .4s ease forwards' }}>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold text-white">TaskFlow</span>
          </div>

          <div className="glass-strong rounded-2xl p-8">
            <h2 className="font-display text-2xl font-bold text-white mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-[13px] text-white/35 mb-7">
              {isLogin ? 'Sign in to your workspace' : 'Get started — it\'s free'}
            </p>

            {/* Form-level error */}
            {errors.form && (
              <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 text-[13px]"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={submit} noValidate className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Full name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                    <input className={`inp pl-10 ${errors.name ? 'inp-error' : ''}`}
                      value={form.name} onChange={set('name')} placeholder="Alex Rivera" autoFocus />
                  </div>
                  {errors.name && <p className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1.5"><AlertCircle size={11} />{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input className={`inp pl-10 ${errors.email ? 'inp-error' : ''}`}
                    type="email" value={form.email} onChange={set('email')} placeholder="you@company.com"
                    autoFocus={isLogin} />
                </div>
                {errors.email && <p className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1.5"><AlertCircle size={11} />{errors.email}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Password</label>
                  {isLogin && (
                    <Link to="/forgot-password"
                      className="text-[11px] font-medium transition-colors"
                      style={{ color: 'rgba(167,139,250,0.7)' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(167,139,250,0.7)'}>
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                  <input className={`inp pl-10 pr-11 ${errors.password ? 'inp-error' : ''}`}
                    type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1">
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1.5"><AlertCircle size={11} />{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['MEMBER', 'ADMIN'].map(r => (
                      <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                        className={`py-3 px-4 rounded-xl border text-[12px] font-semibold transition-all duration-200
                          ${form.role === r
                            ? r === 'ADMIN'
                              ? 'text-violet-300 border-violet-500/50'
                              : 'text-blue-300 border-blue-500/50'
                            : 'text-white/30 border-white/10 hover:border-white/20 hover:text-white/50'}`}
                        style={form.role === r ? {
                          background: r === 'ADMIN' ? 'rgba(124,58,237,0.15)' : 'rgba(37,99,235,0.15)',
                          boxShadow: r === 'ADMIN' ? '0 0 20px rgba(124,58,237,0.2)' : '0 0 20px rgba(37,99,235,0.2)',
                        } : {}}>
                        {r === 'ADMIN' ? '⚡ Admin' : '👤 Member'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="btn-grad w-full py-3 text-[14px] mt-2">
                {loading
                  ? <><span className="spinner" /> <span>Please wait…</span></>
                  : <><span>{isLogin ? 'Sign in' : `Create ${form.role === 'ADMIN' ? 'admin' : 'member'} account`}</span><ArrowRight size={15} /></>
                }
              </button>
            </form>

            {isLogin && (
              <p className="text-[11px] text-center mt-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Demo: <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>admin@taskflow.dev</span> / <span style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>admin123</span>
              </p>
            )}
          </div>

          <p className="text-center text-[13px] mt-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {isLogin
              ? <>No account? <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign up free</Link></>
              : <>Have an account? <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link></>}
          </p>
        </div>
      </div>
    </div>
  );
}
