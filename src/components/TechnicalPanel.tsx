import { TechnicalResult, SecurityHeader } from '../types/analysis.types';
import { Lock, Unlock, Smartphone, Zap, Shield, Globe, CheckCircle, XCircle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import IssueList from './IssueList';
import { getIssueInsight, scoreReasonLabel } from '../lib/insights';

interface Props { tech: TechnicalResult; }

function VitalBadge({ label, value, unit, score }: { label: string; value: number; unit: string; score: string }) {
  const config = { GOOD: { color: 'text-emerald', bg: 'bg-emerald/10 border-emerald/20', label: 'Good' },
    NEEDS_IMPROVEMENT: { color: 'text-solar', bg: 'bg-solar/10 border-solar/20', label: 'Needs Work' },
    POOR: { color: 'text-nova', bg: 'bg-nova/10 border-nova/20', label: 'Poor' },
  }[score] || { color: 'text-ink-soft', bg: 'bg-white/5 border-white/10', label: score };
  const insight = score !== 'GOOD' ? getIssueInsight(label) : null;

  return (
    <div className={`glass rounded-xl p-4 border ${config.bg} text-center`}>
      <div className={`text-2xl font-black ${config.color}`}>{value}{unit}</div>
      <div className="text-xs font-bold text-white mt-1">{label}</div>
      <div className={`text-xs font-medium mt-1 ${config.color}`}>{config.label}</div>
      {insight && (
        <p className="text-[11px] text-ink-soft leading-snug mt-2 pt-2 border-t border-border text-left">
          {insight.fix}
        </p>
      )}
    </div>
  );
}

function HeaderRow({ header }: { header: SecurityHeader }) {
  const impColor = { HIGH: 'text-nova', MEDIUM: 'text-solar', LOW: 'text-cyan' }[header.importance];
  return (
    <tr className="border-b border-white/5 hover:bg-violet/5 transition-colors">
      <td className="py-2.5 px-4">
        <span className="text-sm font-mono text-white">{header.name}</span>
      </td>
      <td className="py-2.5 px-4 text-center">
        {header.present
          ? <CheckCircle size={15} className="text-emerald mx-auto" />
          : <XCircle size={15} className="text-nova mx-auto" />}
      </td>
      <td className="py-2.5 px-4">
        <span className={`text-xs font-bold ${impColor}`}>{header.importance}</span>
      </td>
      <td className="py-2.5 px-4 text-xs text-ink-soft font-mono max-w-xs truncate">
        {header.value ? header.value.slice(0, 40) + (header.value.length > 40 ? '…' : '') : '—'}
      </td>
    </tr>
  );
}

function CheckItem({ label, ok, note }: { label: string; ok: boolean; note?: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${ok ? 'bg-emerald/20' : 'bg-nova/20'}`}>
        {ok ? <CheckCircle size={12} className="text-emerald" /> : <XCircle size={12} className="text-nova" />}
      </div>
      <span className="text-sm text-ink flex-1">{label}</span>
      {note && <span className="text-xs text-ink-faint">{note}</span>}
    </div>
  );
}

export default function TechnicalPanel({ tech }: Props) {
  const radarData = [
    { subject: 'SSL', value: tech.ssl.score },
    { subject: 'Performance', value: tech.performance.score },
    { subject: 'Mobile', value: tech.mobile.score },
    { subject: 'Security', value: tech.security.score },
    { subject: 'Crawl', value: tech.crawlability.score },
    { subject: 'A11y', value: tech.accessibility.score },
  ];

  const pageSizeKB = (tech.performance.pageSize / 1024).toFixed(0);
  const loadTimeSec = (tech.performance.loadTime / 1000).toFixed(2);
  const reason = scoreReasonLabel(tech.score);
  const weakVitals = [
    tech.performance.coreWebVitals.lcpScore !== 'GOOD' && 'LCP',
    tech.performance.coreWebVitals.fidScore !== 'GOOD' && 'FID',
    tech.performance.coreWebVitals.clsScore !== 'GOOD' && 'CLS',
  ].filter(Boolean);

  return (
    <div className="space-y-6 page-enter">
      <div className="panel rounded-xl p-4 flex items-center justify-between flex-wrap gap-2 border-l-4"
        style={{ borderLeftColor: reason.tone === 'good' ? '#1F8A5F' : reason.tone === 'ok' ? '#3B5BA5' : reason.tone === 'warn' ? '#C97A2B' : '#C13B3B' }}>
        <p className="text-sm text-ink-soft">
          Technical score <span className="font-bold text-ink">{tech.score}/100</span> &mdash; <span className="font-semibold text-ink">{reason.label}</span>.{' '}
          {weakVitals.length > 0
            ? <>Core Web Vitals are the biggest drag here: {weakVitals.join(', ')} came back below "Good" &mdash; open the Core Web Vitals cards below for the specific fix for each.</>
            : 'Core Web Vitals all came back in the "Good" range for this scan.'}
        </p>
      </div>

      {/* Radar + quick stats */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Radar chart */}
        <div className="glass rounded-xl p-5 border border-violet/10">
          <h3 className="font-bold text-white mb-4">Technical Score Radar</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(14,110,124,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#5A5F6B', fontSize: 11 }} />
                <Radar name="Score" dataKey="value" stroke="#0E6E7C" fill="#0E6E7C" fillOpacity={0.2}
                  strokeWidth={2} dot={{ r: 3, fill: '#0E6E7C' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="glass rounded-xl p-5 border border-violet/10">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Zap size={15} className="text-solar" /> Core Web Vitals</h3>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <VitalBadge label="LCP" value={tech.performance.coreWebVitals.lcp} unit="s" score={tech.performance.coreWebVitals.lcpScore} />
            <VitalBadge label="FID" value={tech.performance.coreWebVitals.fid} unit="ms" score={tech.performance.coreWebVitals.fidScore} />
            <VitalBadge label="CLS" value={tech.performance.coreWebVitals.cls} unit="" score={tech.performance.coreWebVitals.clsScore} />
          </div>
          <div className="text-xs text-ink-faint text-center">
            LCP ≤ 2.5s · FID ≤ 100ms · CLS ≤ 0.1
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className={`text-xl font-black ${parseFloat(loadTimeSec) < 2 ? 'text-emerald' : parseFloat(loadTimeSec) < 4 ? 'text-solar' : 'text-nova'}`}>{loadTimeSec}s</div>
              <div className="text-xs text-ink-soft">Load Time</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-white/5">
              <div className={`text-xl font-black ${parseInt(pageSizeKB) < 1000 ? 'text-emerald' : parseInt(pageSizeKB) < 3000 ? 'text-solar' : 'text-nova'}`}>{parseInt(pageSizeKB) > 1000 ? `${(parseInt(pageSizeKB)/1024).toFixed(1)}MB` : `${pageSizeKB}KB`}</div>
              <div className="text-xs text-ink-soft">Page Size</div>
            </div>
          </div>
        </div>
      </div>

      {/* SSL & Mobile */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5 border border-violet/10">
          <div className="flex items-center gap-2 mb-3">
            {tech.ssl.enabled ? <Lock size={16} className="text-emerald" /> : <Unlock size={16} className="text-nova" />}
            <span className="font-bold text-white">SSL / HTTPS</span>
          </div>
          <div className={`text-2xl font-black mb-1 ${tech.ssl.enabled ? 'text-emerald' : 'text-nova'}`}>
            {tech.ssl.enabled ? '✓ Secure' : '✗ Insecure'}
          </div>
          <p className="text-xs text-ink-soft">
            {tech.ssl.enabled ? 'HTTPS is active. User data and search ranking are protected.' : 'HTTP only — critical ranking factor missing. Install an SSL certificate immediately.'}
          </p>
        </div>

        <div className="glass rounded-xl p-5 border border-violet/10">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={16} className="text-violet-light" />
            <span className="font-bold text-white">Mobile Readiness</span>
          </div>
          <CheckItem label="Viewport meta tag present" ok={tech.mobile.hasViewportMeta} />
          <CheckItem label="Responsive design detected" ok={tech.mobile.isResponsive} />
          <div className={`mt-3 text-sm font-bold ${tech.mobile.hasViewportMeta && tech.mobile.isResponsive ? 'text-emerald' : 'text-solar'}`}>
            {tech.mobile.hasViewportMeta && tech.mobile.isResponsive ? '✓ Mobile-First Ready' : '⚠ Mobile improvements needed'}
          </div>
        </div>
      </div>

      {/* Compression */}
      <div className="glass rounded-xl p-5 border border-violet/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-cyan" />
            <span className="font-bold text-white">Compression</span>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full border ${tech.compression.enabled ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-nova/10 text-nova border-nova/20'}`}>
            {tech.compression.enabled ? tech.compression.type || 'Enabled' : 'Disabled'}
          </span>
        </div>
        <p className="text-sm text-ink-soft">
          {tech.compression.enabled
            ? `${tech.compression.type} compression is active — text resources are delivered in compressed format, improving load time significantly.`
            : 'No compression detected. Enable gzip or Brotli compression to reduce transfer sizes by 60–80%.'}
        </p>
      </div>

      {/* Crawlability */}
      <div className="glass rounded-xl p-5 border border-violet/10">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Globe size={15} className="text-pink" /> Crawlability</h3>
        <CheckItem label="Page is indexable (not noindex)" ok={tech.crawlability.isIndexable} />
        <CheckItem label="Sitemap reference found" ok={tech.crawlability.hasSitemap} />
        <CheckItem label="Robots.txt expected at /robots.txt" ok={true} note="Not verified" />
      </div>

      {/* Accessibility */}
      <div className="glass rounded-xl p-5 border border-violet/10">
        <h3 className="font-bold text-white mb-3">Accessibility</h3>
        <CheckItem label="Skip navigation links present" ok={tech.accessibility.hasSkipLinks} />
        <CheckItem label="ARIA labels / roles detected" ok={tech.accessibility.hasAriaLabels} />
        <CheckItem label="Alt text on images (≥ 80%)" ok={tech.accessibility.hasAltTexts} />
      </div>

      {/* Security Headers */}
      <div className="glass rounded-xl border border-violet/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-violet/10 flex items-center gap-2">
          <Shield size={15} className="text-emerald" />
          <h3 className="font-bold text-white">Security Headers</h3>
          <span className="ml-auto text-xs text-ink-soft">
            {tech.security.headers.filter(h => h.present).length}/{tech.security.headers.length} present
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 text-xs text-ink-soft uppercase">
                <th className="text-left py-2.5 px-4">Header</th>
                <th className="text-center py-2.5 px-4">Status</th>
                <th className="text-left py-2.5 px-4">Importance</th>
                <th className="text-left py-2.5 px-4">Value</th>
              </tr>
            </thead>
            <tbody>
              {tech.security.headers.map(h => <HeaderRow key={h.name} header={h} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issues */}
      {tech.issues.length > 0 && (
        <div>
          <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Shield size={16} className="text-solar" /> Technical Issues</h3>
          <IssueList issues={tech.issues} />
        </div>
      )}

      {/* Recommendations */}
      {tech.recommendations.length > 0 && (
        <div>
          <h3 className="font-bold text-white mb-3">Technical Recommendations</h3>
          <div className="space-y-3">
            {tech.recommendations.map((rec, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-violet/10">
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 border ${rec.priority === 'HIGH' ? 'bg-nova/10 text-nova border-nova/20' : rec.priority === 'MEDIUM' ? 'bg-solar/10 text-solar border-solar/20' : 'bg-cyan/10 text-cyan border-cyan/20'}`}>{rec.priority}</span>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">{rec.title}</div>
                    <div className="text-xs text-ink-soft mb-1.5">{rec.description}</div>
                    <div className="text-xs text-emerald">Impact: {rec.impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
