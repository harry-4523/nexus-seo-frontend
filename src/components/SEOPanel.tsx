import { SEOResult, KeywordData } from '../types/analysis.types';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Image, Link, Tag, FileText } from 'lucide-react';
import IssueList from './IssueList';
import { scoreReasonLabel } from '../lib/insights';

interface Props { seo: SEOResult; }

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald bg-emerald/10 border-emerald/20'
    : score >= 60 ? 'text-cyan bg-cyan/10 border-cyan/20'
    : score >= 40 ? 'text-solar bg-solar/10 border-solar/20'
    : 'text-nova bg-nova/10 border-nova/20';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>{score}/100</span>;
}

function MetaCard({ label, value, length, optimal, score }: { label: string; value: string; length: number; optimal: string; score: number }) {
  return (
    <div className="glass rounded-xl p-4 border border-violet/10">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <ScoreBadge score={score} />
      </div>
      <p className="text-white text-sm font-mono break-all leading-relaxed mb-2">
        {value || <span className="text-nova/70 italic">Not found</span>}
      </p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-soft">{length} characters</span>
        <span className="text-ink-faint">Optimal: {optimal}</span>
      </div>
      <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-violet to-cyan" style={{ width: `${Math.min(100, score)}%` }} />
      </div>
    </div>
  );
}

function KeywordRow({ kw }: { kw: KeywordData }) {
  return (
    <tr className="border-b border-white/5 hover:bg-violet/5 transition-colors">
      <td className="py-2.5 px-3 text-sm text-white font-mono">{kw.keyword}</td>
      <td className="py-2.5 px-3 text-center">
        <span className="text-sm font-bold text-violet-light">{kw.count}</span>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
              style={{ width: `${Math.min(100, kw.density * 20)}%` }} />
          </div>
          <span className="text-xs text-ink-soft w-10 text-right">{kw.density}%</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-center">
        {kw.inTitle ? <CheckCircle size={14} className="text-emerald mx-auto" /> : <span className="text-ink-faint">—</span>}
      </td>
      <td className="py-2.5 px-3 text-center">
        {kw.inH1 ? <CheckCircle size={14} className="text-emerald mx-auto" /> : <span className="text-ink-faint">—</span>}
      </td>
      <td className="py-2.5 px-3 text-center">
        {kw.inMeta ? <CheckCircle size={14} className="text-emerald mx-auto" /> : <span className="text-ink-faint">—</span>}
      </td>
    </tr>
  );
}

export default function SEOPanel({ seo }: Props) {
  const reason = scoreReasonLabel(seo.score);
  return (
    <div className="space-y-6 page-enter">
      <div className={`panel rounded-xl p-4 flex items-center justify-between flex-wrap gap-2 border-l-4`}
        style={{ borderLeftColor: reason.tone === 'good' ? '#1F8A5F' : reason.tone === 'ok' ? '#3B5BA5' : reason.tone === 'warn' ? '#C97A2B' : '#C13B3B' }}>
        <p className="text-sm text-ink-soft">
          SEO score <span className="font-bold text-ink">{seo.score}/100</span> &mdash; <span className="font-semibold text-ink">{reason.label}</span>.{' '}
          {seo.issues.length > 0
            ? `Driven mainly by ${seo.issues.length} flagged issue${seo.issues.length > 1 ? 's' : ''} below, especially anything marked as an error.`
            : 'No on-page errors were flagged in this scan.'}
        </p>
      </div>
      {/* Meta Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <MetaCard label="Page Title" value={seo.title.value} length={seo.title.length} optimal="30–70 chars" score={seo.title.score} />
        <MetaCard label="Meta Description" value={seo.metaDescription.value} length={seo.metaDescription.length} optimal="80–165 chars" score={seo.metaDescription.score} />
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <FileText size={16} />, label: 'Word Count', value: seo.wordCount.toLocaleString(),
            sub: seo.wordCount >= 300 ? 'Good — enough content for search engines to understand the page' : 'Low — thin content is harder to rank',
            ok: seo.wordCount >= 300,
            hint: 'Total visible words on the page. Search engines generally need enough text to understand what a page is about; under ~300 words is considered "thin content."' },
          { icon: <Link size={16} />, label: 'Internal Links', value: seo.links.internal,
            sub: seo.links.internal > 2 ? `Outbound: ${seo.links.external}` : `Too few — outbound: ${seo.links.external}`,
            ok: seo.links.internal > 2,
            hint: 'Internal links = links to other pages on your own site (help crawlers discover pages and spread ranking value). Outbound = links to other domains.' },
          { icon: <Image size={16} />, label: 'Images w/ Alt',
            value: seo.images.total === 0 ? 'No images' : `${seo.images.withAlt}/${seo.images.total}`,
            sub: seo.images.total === 0 ? 'This page has no <img> tags to check' : seo.images.withoutAlt === 0 ? 'All images have alt text' : `${seo.images.withoutAlt} missing descriptive alt text`,
            ok: seo.images.total === 0 || seo.images.withoutAlt === 0,
            hint: 'Alt text is the description read by screen readers and search engine image crawlers. "0/0" doesn\u2019t mean an error — it means the scan found zero images on this page, so there was nothing to check.' },
          { icon: <Tag size={16} />, label: 'Schema Types', value: seo.schema.present ? seo.schema.types.length : 0,
            sub: seo.schema.present ? `Detected: ${seo.schema.types[0]}` : 'No structured data found on this page',
            ok: seo.schema.present,
            hint: 'Schema (JSON-LD structured data) explicitly tells search engines and AI answer engines what your content is — an article, product, FAQ, business, etc.' },
        ].map(({ icon, label, value, sub, ok, hint }) => (
          <div key={label} title={hint} className="glass rounded-xl p-4 border border-violet/10 flex flex-col gap-2 cursor-help">
            <div className="flex items-center justify-between">
              <span className="text-ink-soft">{icon}</span>
              <div className={`w-2 h-2 rounded-full ${ok ? 'bg-emerald' : 'bg-solar'}`} />
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-xs text-ink-soft">{label}</div>
            <div className={`text-xs font-medium leading-snug ${ok ? 'text-emerald' : 'text-solar'}`}>{sub}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-faint -mt-2">Hover any card above for what it measures and how it\u2019s judged.</p>

      {/* Headings */}
      <div className="glass rounded-xl p-5 border border-violet/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Heading Structure</h3>
          <ScoreBadge score={seo.headings.score} />
        </div>
        <div className="space-y-2">
          {[['H1', seo.headings.h1, 'text-violet-light'], ['H2', seo.headings.h2, 'text-cyan'], ['H3', seo.headings.h3, 'text-pink']].map(([level, tags, color]) => (
            <div key={level as string}>
              <span className={`text-xs font-bold font-mono ${color as string} mr-2`}>{level as string}</span>
              {(tags as string[]).length === 0
                ? <span className="text-xs text-nova/60 italic">None found</span>
                : (tags as string[]).slice(0, 3).map((t, i) => (
                  <span key={i} className="text-xs text-ink-soft mr-2 bg-white/5 px-2 py-0.5 rounded">{t.slice(0, 60)}{t.length > 60 ? '…' : ''}</span>
                ))}
              {(tags as string[]).length > 3 && <span className="text-xs text-ink-faint">+{(tags as string[]).length - 3} more</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Social Tags */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-5 border border-violet/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white text-sm">Open Graph</h3>
            <ScoreBadge score={seo.openGraph.score} />
          </div>
          {seo.openGraph.present
            ? Object.entries(seo.openGraph.tags).slice(0, 5).map(([k, v]) => (
              <div key={k} className="flex gap-2 text-xs py-1 border-b border-white/5">
                <span className="text-violet-light font-mono w-20 shrink-0">{k}</span>
                <span className="text-ink-soft truncate">{v}</span>
              </div>
            ))
            : <p className="text-sm text-nova/70">No Open Graph tags detected</p>}
        </div>
        <div className="glass rounded-xl p-5 border border-violet/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white text-sm">Twitter Card</h3>
            <ScoreBadge score={seo.twitterCard.score} />
          </div>
          {seo.twitterCard.present
            ? Object.entries(seo.twitterCard.tags).slice(0, 5).map(([k, v]) => (
              <div key={k} className="flex gap-2 text-xs py-1 border-b border-white/5">
                <span className="text-cyan font-mono w-20 shrink-0">{k}</span>
                <span className="text-ink-soft truncate">{v}</span>
              </div>
            ))
            : <p className="text-sm text-nova/70">No Twitter Card tags detected</p>}
        </div>
      </div>

      {/* Schema Types */}
      {seo.schema.present && (
        <div className="glass rounded-xl p-5 border border-violet/10">
          <h3 className="font-bold text-white mb-3">Detected Schema Types</h3>
          <div className="flex flex-wrap gap-2">
            {seo.schema.types.map(type => (
              <span key={type} className="px-3 py-1.5 rounded-lg bg-emerald/10 border border-emerald/20 text-xs font-bold text-emerald flex items-center gap-1.5">
                <CheckCircle size={11} /> {type}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Keywords Table */}
      {seo.keywords.length > 0 && (
        <div className="glass rounded-xl border border-violet/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-violet/10">
            <h3 className="font-bold text-white">Top Keywords & Density</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-xs text-ink-soft uppercase tracking-wider">
                  <th className="text-left py-2.5 px-3">Keyword</th>
                  <th className="text-center py-2.5 px-3">Count</th>
                  <th className="py-2.5 px-3 text-left">Density</th>
                  <th className="text-center py-2.5 px-3">Title</th>
                  <th className="text-center py-2.5 px-3">H1</th>
                  <th className="text-center py-2.5 px-3">Meta</th>
                </tr>
              </thead>
              <tbody>
                {seo.keywords.slice(0, 15).map(kw => <KeywordRow key={kw.keyword} kw={kw} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Canonical & Robots */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-xl p-4 border border-violet/10">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink size={14} className="text-ink-soft" />
            <span className="text-sm font-semibold text-ink">Canonical URL</span>
            <ScoreBadge score={seo.canonical.score} />
          </div>
          <p className="text-xs font-mono text-ink-soft break-all">{seo.canonical.url || 'Not set'}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-violet/10">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-ink-soft" />
            <span className="text-sm font-semibold text-ink">Robots Meta</span>
            <ScoreBadge score={seo.robots.score} />
          </div>
          <p className="text-xs font-mono text-ink-soft">{seo.robots.meta}</p>
        </div>
      </div>

      {/* Issues */}
      {seo.issues.length > 0 && (
        <div>
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <AlertCircle size={16} className="text-solar" /> Issues Found
          </h3>
          <IssueList issues={seo.issues} />
        </div>
      )}

      {/* Recommendations */}
      {seo.recommendations.length > 0 && (
        <div>
          <h3 className="font-bold text-white mb-3">Recommendations</h3>
          <div className="space-y-3">
            {seo.recommendations.map((rec, i) => (
              <div key={i} className="glass rounded-xl p-4 border border-violet/10">
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                    rec.priority === 'HIGH' ? 'bg-nova/10 text-nova border border-nova/20' :
                    rec.priority === 'MEDIUM' ? 'bg-solar/10 text-solar border border-solar/20' :
                    'bg-cyan/10 text-cyan border border-cyan/20'}`}>{rec.priority}</span>
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
