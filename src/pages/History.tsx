import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Globe, Trash2, ExternalLink, ArrowRight, LogIn } from 'lucide-react';
import { useAnalysisStore } from '../store/analysis.store';
import { getUserScans, deleteScan } from '../api/client';
import { ScanSummary } from '../types/analysis.types';

function ScorePill({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? 'text-emerald bg-emerald/10' : score >= 60 ? 'text-cyan bg-cyan/10' : score >= 40 ? 'text-solar bg-solar/10' : 'text-nova bg-nova/10';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded ${color}`}>{label} {score}</span>;
}

export default function History() {
  const navigate = useNavigate();
  const { user, setScanHistory, setCurrentResult } = useAnalysisStore();
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getUserScans()
      .then(data => { setScans(data.data); setScanHistory(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, setScanHistory]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteScan(id);
      setScans(prev => prev.filter(s => s.id !== id));
    } catch {}
    setDeleting(null);
  };

  const handleView = (scan: ScanSummary) => {
    setCurrentResult(null);
    navigate(`/results/${scan.id}`);
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-6">
      <div className="glass rounded-2xl p-10 text-center max-w-sm border border-violet/20">
        <LogIn size={32} className="text-violet-light mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Sign in to view history</h2>
        <p className="text-ink-soft text-sm mb-6">Your scan history is saved when you're signed in.</p>
        <Link to="/auth" className="btn-primary text-sm block text-center">Sign In / Register</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Scan History</h1>
            <p className="text-ink-soft">{scans.length} saved analysis reports</p>
          </div>
          <Link to="/analyze" className="btn-primary text-sm flex items-center gap-2">
            New Scan <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="glass rounded-xl h-24 shimmer border border-violet/10" />)}
          </div>
        ) : scans.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border border-violet/20">
            <Globe size={36} className="text-ink-faint mx-auto mb-4" />
            <p className="text-ink-soft mb-2">No scans yet</p>
            <p className="text-ink-faint text-sm mb-6">Start by analyzing your first website.</p>
            <Link to="/analyze" className="btn-primary text-sm">Analyze a Website</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map(scan => {
              const overallColor = scan.overallScore >= 80 ? 'text-emerald' : scan.overallScore >= 60 ? 'text-cyan' : scan.overallScore >= 40 ? 'text-solar' : 'text-nova';
              return (
                <div key={scan.id} className="glass rounded-xl p-5 border border-violet/10 glass-hover flex items-center gap-4">
                  {/* Score */}
                  <div className={`text-3xl font-black w-14 text-center shrink-0 ${overallColor}`}>{scan.overallScore}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white truncate">{scan.domain}</span>
                      <a href={scan.url} target="_blank" rel="noopener noreferrer" className="text-ink-faint hover:text-violet-light shrink-0"><ExternalLink size={12} /></a>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <ScorePill label="SEO" score={scan.seoScore} />
                      <ScorePill label="AEO" score={scan.aeoScore} />
                      <ScorePill label="Geo" score={scan.geoScore} />
                      <ScorePill label="Tech" score={scan.techScore} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ink-faint">
                      <span className="flex items-center gap-1"><Clock size={10} /> {(scan.duration / 1000).toFixed(1)}s</span>
                      <span>{new Date(scan.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleView(scan)} className="btn-ghost text-xs py-1.5 px-3">View Report</button>
                    <button onClick={() => handleDelete(scan.id)} disabled={deleting === scan.id}
                      className="p-2 rounded-lg text-ink-faint hover:text-nova hover:bg-nova/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
