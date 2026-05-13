import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { authApi } from '../api';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState('idle'); // idle | loading | sent | error
  const [errMsg,  setErrMsg]  = useState('');
  const [devLink, setDevLink] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (!email.trim()) { setErrMsg('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setErrMsg('Enter a valid email'); return; }

    setStatus('loading'); setErrMsg('');
    try {
      const res = await authApi.forgotPassword(email.trim().toLowerCase());
      // In dev mode the API returns the reset link directly
      if (res.data.devLink) setDevLink(res.data.devLink);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrMsg(
        err?.response?.data?.error ||
        (!err?.response ? 'Cannot connect to server. Check your connection.' : 'Something went wrong. Try again.')
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#020209' }}>
      {/* ambient blob */}
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
          {status !== 'sent' ? (
            <>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                <Mail size={22} className="text-violet-400" />
              </div>

              <h2 className="font-display text-[22px] font-bold text-white mb-2">Forgot password?</h2>
              <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                No worries. Enter your email and we'll send you a reset link that's valid for 1 hour.
              </p>

              {errMsg && (
                <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-4 text-[13px]"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{errMsg}</span>
                </div>
              )}

              <form onSubmit={submit} noValidate>
                <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>Email address</label>
                <div className="relative mb-5">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrMsg(''); }}
                    placeholder="you@company.com"
                    autoFocus
                    className="inp pl-10"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${errMsg ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 12,
                      padding: '11px 14px 11px 38px',
                      color: '#f1f0ff',
                      fontSize: 14,
                      outline: 'none',
                      width: '100%',
                    }}
                  />
                </div>

                <button type="submit" disabled={status === 'loading'}
                  className="w-full py-3 rounded-xl font-semibold text-[14px] text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb,#db2777)' }}>
                  {status === 'loading'
                    ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Sending…</>
                    : 'Send reset link →'}
                </button>
              </form>
            </>
          ) : (
            /* ── Success state ── */
            <>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <CheckCircle size={26} className="text-emerald-400" />
              </div>

              <h2 className="font-display text-[22px] font-bold text-white mb-3 text-center">Check your email</h2>
              <p className="text-[13px] text-center mb-2" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                We sent a password reset link to
              </p>
              <p className="text-center font-semibold text-violet-400 text-[14px] mb-6 break-all">{email}</p>
              <p className="text-[12px] text-center" style={{ color: 'rgba(255,255,255,0.25)', lineHeight: 1.7 }}>
                The link expires in 1 hour. Check your spam folder if you don't see it within a few minutes.
              </p>

              {/* Dev mode — show the link directly */}
              {devLink && (
                <div className="mt-5 rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                  <p className="text-[11px] font-semibold text-amber-400 mb-2 uppercase tracking-wider">
                    Dev mode — no SMTP configured
                  </p>
                  <p className="text-[11px] text-amber-300/60 mb-2">Copy this link to reset the password:</p>
                  <a href={devLink}
                    className="block text-[11px] text-amber-300 break-all underline underline-offset-2 hover:text-amber-200 transition-colors"
                    style={{ fontFamily: 'monospace' }}>
                    {devLink}
                  </a>
                </div>
              )}

              <button onClick={() => { setStatus('idle'); setDevLink(''); }}
                className="w-full mt-5 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
                Try a different email
              </button>
            </>
          )}
        </div>

        <div className="mt-5 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-[13px] transition-colors"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
            <ArrowLeft size={13} /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
