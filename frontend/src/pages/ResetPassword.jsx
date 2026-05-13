import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, Zap, AlertCircle, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { authApi } from '../api';

export default function ResetPassword() {
  const [params]                  = useSearchParams();
  const navigate                  = useNavigate();
  const token                     = params.get('token') || '';
  const email                     = params.get('email') || '';

  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [showCf,    setShowCf]    = useState(false);
  const [status,    setStatus]    = useState('idle'); // idle | loading | success | error
  const [errMsg,    setErrMsg]    = useState('');
  const [fieldErrs, setFieldErrs] = useState({});

  // If no token/email in URL, show invalid state immediately
  const invalidLink = !token || !email;

  function validate() {
    const e = {};
    if (!password)              e.password = 'New password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!confirm)               e.confirm  = 'Please confirm your new password';
    else if (confirm !== password) e.confirm = 'Passwords do not match';
    setFieldErrs(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading'); setErrMsg('');
    try {
      await authApi.resetPassword({ token, email, password });
      setStatus('success');
      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus('error');
      setErrMsg(
        err?.response?.data?.error ||
        (!err?.response ? 'Cannot connect to server.' : 'Something went wrong. Try again.')
      );
    }
  }

  const inputStyle = (field) => ({
    background:   'rgba(255,255,255,0.04)',
    border:       `1px solid ${fieldErrs[field] ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12,
    padding:      '11px 44px 11px 14px',
    color:        '#f1f0ff',
    fontSize:     14,
    outline:      'none',
    width:        '100%',
    transition:   'border-color .2s',
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#020209' }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
        <div className="absolute bottom-[-5%] right-[10%] w-[350px] h-[350px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle,#2563eb,transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-[380px]" style={{ animation: 'fadeUp .35s ease forwards' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}>
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-white">TaskFlow</span>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 18,
          padding: 32,
          backdropFilter: 'blur(20px)',
        }}>

          {/* ── Invalid link ── */}
          {invalidLink && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertCircle size={26} className="text-red-400" />
              </div>
              <h2 className="font-display text-[22px] font-bold text-white mb-3">Invalid reset link</h2>
              <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                This reset link is missing required information. Please request a new one.
              </p>
              <Link to="/forgot-password"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl font-semibold text-[14px] text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
                Request new link
              </Link>
            </div>
          )}

          {/* ── Success state ── */}
          {!invalidLink && status === 'success' && (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <CheckCircle size={26} className="text-emerald-400" />
              </div>
              <h2 className="font-display text-[22px] font-bold text-white mb-3">Password updated!</h2>
              <p className="text-[13px] mb-2" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Your password has been reset successfully. Redirecting you to sign in…
              </p>
              <div className="w-8 h-8 mx-auto mt-4">
                <span className="spinner" style={{ width: 24, height: 24 }} />
              </div>
            </div>
          )}

          {/* ── Form ── */}
          {!invalidLink && status !== 'success' && (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <ShieldCheck size={22} className="text-violet-400" />
              </div>

              <h2 className="font-display text-[22px] font-bold text-white mb-2">Set new password</h2>
              <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Choose a strong password for <span style={{ color: 'rgba(167,139,250,0.8)' }}>{email}</span>
              </p>

              {/* Form-level error (e.g. expired token) */}
              {errMsg && (
                <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-4 text-[13px]"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span>{errMsg}</span>
                    {errMsg.includes('expired') && (
                      <div className="mt-2">
                        <Link to="/forgot-password" className="underline underline-offset-2 font-medium">
                          Request a new link →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form onSubmit={submit} noValidate className="space-y-4">
                {/* New password */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>New password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password}
                      onChange={e => { setPassword(e.target.value); setFieldErrs(f => ({...f, password: null})); }}
                      placeholder="Min 6 characters" autoFocus style={inputStyle('password')} />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {fieldErrs.password && (
                    <p className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1.5">
                      <AlertCircle size={11} />{fieldErrs.password}
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>Confirm new password</label>
                  <div className="relative">
                    <input type={showCf ? 'text' : 'password'} value={confirm}
                      onChange={e => { setConfirm(e.target.value); setFieldErrs(f => ({...f, confirm: null})); }}
                      placeholder="Repeat password" style={inputStyle('confirm')} />
                    <button type="button" onClick={() => setShowCf(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                      style={{ color: 'rgba(255,255,255,0.3)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
                      {showCf ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {fieldErrs.confirm && (
                    <p className="flex items-center gap-1.5 text-[11px] text-red-400 mt-1.5">
                      <AlertCircle size={11} />{fieldErrs.confirm}
                    </p>
                  )}
                  {/* Match indicator */}
                  {confirm && !fieldErrs.confirm && password === confirm && (
                    <p className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1.5">
                      <CheckCircle size={11} /> Passwords match
                    </p>
                  )}
                </div>

                {/* Password strength hint */}
                {password && (
                  <div className="flex gap-1.5">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300" style={{
                        background: password.length >= i * 3
                          ? i <= 2 ? '#f87171' : i === 3 ? '#fbbf24' : '#34d399'
                          : 'rgba(255,255,255,0.08)'
                      }} />
                    ))}
                    <span className="text-[10px] ml-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {password.length < 6 ? 'Weak' : password.length < 9 ? 'Fair' : password.length < 12 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}

                <button type="submit" disabled={status === 'loading'}
                  className="w-full py-3 rounded-xl font-semibold text-[14px] text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb,#db2777)' }}>
                  {status === 'loading'
                    ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Resetting…</>
                    : <><Lock size={14} /> Set new password</>}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-5 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-[13px] transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
            <ArrowLeft size={13} /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
