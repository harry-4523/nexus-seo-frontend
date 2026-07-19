import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ExternalLink, Clock, Globe, Search, Brain, Shield, RefreshCw } from 'lucide-react';
import { useAnalysisStore } from '../store/analysis.store';
import { getScan } from '../api/client';
import ScoreGauge, { OverallScoreRing } from '../components/ScoreGauge';
import SEOPanel from '../components/SEOPanel';
import AEOPanel from '../components/AEOPanel';
import GeoPanel from '../components/GeoPanel';
import TechnicalPanel from '../components/TechnicalPanel';
import { AnalysisResult } from '../types/analysis.types';

gsap.registerPlugin(ScrollTrigger);

const TABS = [
  { id: 'seo', label: 'SEO Analysis', icon: <Search size={15} />, color: 'from-violet to-purple-400' },
  { id: 'aeo', label: 'AEO Intelligence', icon: <Brain size={15} />, color: 'from-cyan-500 to-blue-500' },
  { id: 'geo', label: 'Geo Engagement', icon: <Globe size={15} />, color: 'from-pink-500 to-rose-400' },
  { id: 'technical', label: 'Technical Audit', icon: <Shield size={15} />, color: 'from-emerald-500 to-teal-400' },
];

export default function Results() {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const { currentResult, setCurrentResult, activeTab, setActiveTab } = useAnalysisStore();
  const [result, setResult] = useState<AnalysisResult | null>(currentResult);
  const [loading, setLoading] = useState(!currentResult);
  const [error, setError] = useState('');
  const headerRef = useRef<HTMLDivElement>(null);
  const scoresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentResult && scanId) {
      setLoading(true);
      getScan(scanId)
        .then(data => {
          const r = data.data.result as AnalysisResult;
          setResult(r);
          setCurrentResult(r);
        })
        .catch(() => setError('Could not load this scan.'))
        .finally(() => setLoading(false));
    }
  }, [scanId, currentResult, setCurrentResult]);

  useEffect(() => {
    if (!result) return;
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    tl.fromTo(scoresRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');
    tl.fromTo('.tab-content', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [result]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-violet/20 border-t-violet rounded-full animate-spin mx-auto mb-4" />
        <p className="text-ink-soft">Loading analysis...</p>
      </div>
    </div>
  );

  if (error || !result) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center glass rounded-2xl p-8 max-w-sm">
        <p className="text-nova mb-4">{error || 'Scan not found'}</p>
        <Link to="/analyze" className="btn-primary text-sm">New Analysis</Link>
      </div>
    </div>
  );

  const duration = result.duration ? (result.duration / 1000).toFixed(1) : '—';

  return (
    <div className="min-h-screen pt-16">
      {/* Fixed sticky header bar */}
      <div ref={headerRef} className="sticky top-16 z-40 glass border-b border-violet/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/analyze')}
              className="text-ink-soft hover:text-white transition-colors p-1">
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm truncate max-w-xs">{result.domain}</span>
                <a href={result.url} target="_blank" rel="noopener noreferrer"
                  className="text-ink-faint hover:text-violet-light transition-colors">
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs text-ink-faint mt-0.5">
                <span className="flex items-center gap-1"><Clock size={10} /> {duration}s scan</span>
                <span>{new Date(result.scannedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Mini score pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'SEO', score: result.seo.score },
              { label: 'AEO', score: result.aeo.score },
              { label: 'Geo', score: result.geo.score },
              { label: 'Tech', score: result.technical.score },
            ].map(({ label, score }) => {
              const color = score >= 80 ? 'text-emerald border-emerald/30 bg-emerald/10' :
                score >= 60 ? 'text-cyan border-cyan/30 bg-cyan/10' :
                score >= 40 ? 'text-solar border-solar/30 bg-solar/10' :
                'text-nova border-nova/30 bg-nova/10';
              return (
                <span key={label} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${color}`}>
                  {label}: {score}
                </span>
              );
            })}
            <button onClick={() => { setCurrentResult(null); navigate('/analyze'); }}
              className="text-ink-soft hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5" title="New scan">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Score overview */}
        <div ref={scoresRef} className="glass rounded-2xl p-8 border border-violet/20 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {/* Overall score — center on desktop */}
            <div className="col-span-2 md:col-span-1 flex justify-center order-first md:order-2">
              <OverallScoreRing score={result.overallScore} />
            </div>

            {/* Individual scores */}
            <div className="col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:order-1">
              <ScoreGauge score={result.seo.score} label="SEO" delay={0.2} />
              <ScoreGauge score={result.aeo.score} label="AEO" delay={0.35} />
              <ScoreGauge score={result.geo.score} label="Geo" delay={0.5} />
              <ScoreGauge score={result.technical.score} label="Technical" delay={0.65} />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 pt-6 border-t border-violet/10 grid md:grid-cols-4 gap-4">
            {[
              { label: 'Total Issues', value: (result.seo.issues.length + result.aeo.issues.length + result.geo.issues.length + result.technical.issues.length), color: 'text-nova' },
              { label: 'Recommendations', value: (result.seo.recommendations.length + result.aeo.recommendations.length + result.geo.recommendations.length + result.technical.recommendations.length), color: 'text-solar' },
              { label: 'Keywords Found', value: result.seo.keywords.length, color: 'text-violet-light' },
              { label: 'Word Count', value: result.seo.wordCount.toLocaleString(), color: 'text-cyan' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <div className={`text-2xl font-black ${color}`}>{value}</div>
                <div className="text-xs text-ink-soft mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl border border-violet/20 overflow-hidden">
          {/* Tab header */}
          <div className="flex overflow-x-auto border-b border-violet/20 scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id ? 'tab-active' : 'tab-inactive'}`}
              >
                <span className={activeTab === tab.id ? 'text-violet-light' : ''}>{tab.icon}</span>
                {tab.label}
                {/* Score pill in tab */}
                {(() => {
                  const score = tab.id === 'seo' ? result.seo.score : tab.id === 'aeo' ? result.aeo.score : tab.id === 'geo' ? result.geo.score : result.technical.score;
                  const color = score >= 80 ? 'bg-emerald/20 text-emerald' : score >= 60 ? 'bg-cyan/20 text-cyan' : score >= 40 ? 'bg-solar/20 text-solar' : 'bg-nova/20 text-nova';
                  return <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${color}`}>{score}</span>;
                })()}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="tab-content p-6 md:p-8">
            {activeTab === 'seo' && <SEOPanel seo={result.seo} />}
            {activeTab === 'aeo' && <AEOPanel aeo={result.aeo} />}
            {activeTab === 'geo' && <GeoPanel geo={result.geo} />}
            {activeTab === 'technical' && <TechnicalPanel tech={result.technical} />}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 text-center">
          <button onClick={() => { setCurrentResult(null); navigate('/analyze'); }}
            className="btn-ghost text-sm">
            ← Analyze another website
          </button>
        </div>
      </div>
    </div>
  );
}
