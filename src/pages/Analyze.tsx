import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Search, ArrowRight, Loader2, AlertCircle, Globe, Lock, Zap, Brain } from 'lucide-react';
import { useAnalysisStore } from '../store/analysis.store';
import { analyzeUrl } from '../api/client';

const STAGES = [
  { pct: 10, label: 'Launching headless browser', icon: <Globe size={16} /> },
  { pct: 25, label: 'Navigating to URL', icon: <ArrowRight size={16} /> },
  { pct: 40, label: 'Scraping page content', icon: <Search size={16} /> },
  { pct: 55, label: 'Analyzing SEO factors', icon: <Zap size={16} /> },
  { pct: 68, label: 'Running AEO intelligence', icon: <Brain size={16} /> },
  { pct: 78, label: 'Detecting geo signals', icon: <Globe size={16} /> },
  { pct: 87, label: 'Technical audit', icon: <Lock size={16} /> },
  { pct: 95, label: 'Computing final scores', icon: <Zap size={16} /> },
  { pct: 100, label: 'Report ready!', icon: <Zap size={16} /> },
];

const EXAMPLES = [
  'https://github.com', 'https://tailwindcss.com', 'https://vercel.com',
  'https://stripe.com', 'https://notion.so', 'https://linear.app',
];

export default function Analyze() {
  const navigate = useNavigate();
  const { isAnalyzing, analysisError, analysisProgress, analysisStage,
    setCurrentResult, setIsAnalyzing, setAnalysisError, setAnalysisProgress } = useAnalysisStore();
  const [url, setUrl] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    );
  }, []);

  // Animate progress bar
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${analysisProgress}%`,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }, [analysisProgress]);

  const handleAnalyze = async (inputUrl?: string) => {
    const target = inputUrl || url.trim();
    if (!target) return;
    let finalUrl = target;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentResult(null);
    setAnalysisProgress(0, '');

    let stageIdx = 0;
    const progressInterval = setInterval(() => {
      if (stageIdx < STAGES.length - 1) {
        const s = STAGES[stageIdx];
        setAnalysisProgress(s.pct, s.label);
        stageIdx++;
      }
    }, 3000);

    try {
      const data = await analyzeUrl(finalUrl);
      clearInterval(progressInterval);
      setAnalysisProgress(100, 'Report ready!');
      setCurrentResult(data.data);
      setTimeout(() => navigate(`/results/${data.data.scanId}`), 800);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || 'Could not reach the URL. Check it is publicly accessible.';
      setAnalysisError(msg);
      setIsAnalyzing(false);
      setAnalysisProgress(0, '');
    }
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-6 py-24">
      {/* Glow orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-violet/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div ref={containerRef} className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet/30 text-sm text-violet-light mb-6">
            <Zap size={13} className="text-cyan" /> Powered by Puppeteer + Real Browser Analysis
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Analyze <span className="gradient-text">Any Website</span>
          </h1>
          <p className="text-ink-soft text-lg">
            Enter a URL and get a complete SEO, AEO, Geo & Technical intelligence report.
          </p>
        </div>

        {/* Input Card */}
        {!isAnalyzing && (
          <div className="glass rounded-2xl p-6 border border-violet/20 mb-6">
            <form onSubmit={e => { e.preventDefault(); handleAnalyze(); }}>
              <div className="relative mb-4">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet to-cyan opacity-40 blur" />
                <div className="relative flex items-center glass rounded-xl border border-violet/30 overflow-hidden">
                  <div className="pl-4 text-ink-soft"><Search size={18} /></div>
                  <input
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="flex-1 bg-transparent px-3 py-4 text-white placeholder-ink-faint outline-none font-mono text-base"
                    autoFocus
                  />
                </div>
              </div>

              {analysisError && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-nova/10 border border-nova/30 mb-4 text-sm text-nova">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-nova" />
                  {analysisError}
                </div>
              )}

              <button type="submit" disabled={!url.trim()}
                className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                <Search size={18} /> Run Full Analysis <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="glass rounded-2xl p-8 border border-violet/20 text-center">
            {/* Animated scanner visual */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-2 border-violet/20" />
              <div className="absolute inset-2 rounded-full border border-cyan/20" />
              <div className="absolute inset-4 rounded-full border border-pink/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-violet animate-spin" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-3 rounded-full border-t border-cyan animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-violet animate-spin" />
              </div>
              <div className="absolute inset-0 flex items-end justify-center pb-3">
                <span className="text-sm font-bold text-violet-light">{analysisProgress}%</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Analyzing Website</h3>
            <p className="text-ink-soft text-sm mb-6 font-mono">{url}</p>

            {/* Progress bar */}
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
              <div ref={progressRef} className="h-full rounded-full bg-gradient-to-r from-violet to-cyan transition-all" style={{ width: '0%' }} />
            </div>

            {/* Stage list */}
            <div className="space-y-2 text-left">
              {STAGES.map((stage, i) => {
                const done = stage.pct <= analysisProgress;
                const active = analysisStage === stage.label;
                return (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    active ? 'bg-violet/15 border border-violet/30' :
                    done ? 'opacity-50' : 'opacity-25'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      done ? 'bg-emerald text-white' : active ? 'bg-violet text-white animate-pulse' : 'bg-white/5 text-ink-faint'}`}>
                      {done ? '✓' : stage.icon}
                    </div>
                    <span className={`text-sm font-medium ${active ? 'text-white' : done ? 'text-ink-soft' : 'text-ink-faint'}`}>
                      {stage.label}
                    </span>
                    {active && <Loader2 size={12} className="ml-auto text-violet animate-spin" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Example URLs */}
        {!isAnalyzing && (
          <div>
            <p className="text-center text-ink-faint text-xs mb-3 uppercase tracking-widest">Try an example</p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => { setUrl(ex); handleAnalyze(ex); }}
                  className="px-3 py-1.5 rounded-lg glass border border-violet/10 text-xs text-ink-soft hover:text-violet-light hover:border-violet/30 transition-all font-mono">
                  {ex.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
