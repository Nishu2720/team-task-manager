import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* modal */}
      <div className={`relative w-full ${maxWidth} animate-scale-in max-h-[90vh] overflow-y-auto`}
        style={{ animation: 'scaleIn .2s ease forwards' }}>
        {/* gradient border wrapper */}
        <div className="absolute -inset-[1px] rounded-2xl opacity-60"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.6), rgba(59,130,246,0.4), rgba(236,72,153,0.4))' }} />
        <div className="relative glass-strong rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="font-display text-base font-semibold text-white">{title}</h2>
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40
                         hover:text-white hover:bg-white/10 transition-all duration-150">
              <X size={14} />
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
