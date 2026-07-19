import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Mail, Lock, User, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import { login, register } from '../api/client';
import { useAnalysisStore } from '../store/analysis.store';

export default function Auth() {
  const navigate = useNavigate();
  const { user, setUser, setToken } = useAnalysisStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);

  useEffect(() => {
    gsap.fromTo(cardRef.current, { opacity: 0, y: 40, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = mode === 'login'
        ? await login(email, password)
        : await register(email, password, name || undefined);
      setToken(data.token);
      setUser(data.user);
      navigate('/analyze');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => { setMode(m => m === 'login' ? 'register' : 'login'); setError(''); };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-16 grid-bg">
      <div className="fixed top-1/3 left-1/3 w-72 h-72 bg-violet/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/3 w-72 h-72 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div ref={cardRef} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-cyan flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-black"><span className="gradient-text">NEX</span><span className="text-white">US</span></span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-ink-soft text-sm">
            {mode === 'login' ? 'Sign in to access your scan history' : 'Save your analysis reports forever'}
          </p>
        </div>

        <div className="panel rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input type="text" placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-violet/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-ink-faint text-sm outline-none focus:border-violet/50 transition-colors" />
              </div>
            )}
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-white/5 border border-violet/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-ink-faint text-sm outline-none focus:border-violet/50 transition-colors" />
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-white/5 border border-violet/20 rounded-xl pl-10 pr-10 py-3 text-white placeholder-ink-faint text-sm outline-none focus:border-violet/50 transition-colors" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-nova/10 border border-nova/20 text-sm text-nova">
                <AlertCircle size={14} className="shrink-0 text-nova" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-[#F7F7F4]/30 border-t-[#F7F7F4] rounded-full animate-spin" /> : null}
              {loading ? 'Processing…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-ink-soft">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={switchMode} className="text-violet-light hover:text-white font-semibold transition-colors">
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-ink-faint mt-4">
          No account needed for one-off analysis.{' '}
          <Link to="/analyze" className="text-violet-light hover:text-white">Analyze without account →</Link>
        </p>
      </div>
    </div>
  );
}
