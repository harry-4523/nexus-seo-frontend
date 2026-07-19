import { GeoResult, CountryTraffic } from '../types/analysis.types';
import { Globe, Wifi } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import IssueList from './IssueList';
import { scoreReasonLabel } from '../lib/insights';

interface Props { geo: GeoResult; }

const FLAG_EMOJIS: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', IN: '🇮🇳', CA: '🇨🇦', AU: '🇦🇺', DE: '🇩🇪',
  FR: '🇫🇷', BR: '🇧🇷', JP: '🇯🇵', NL: '🇳🇱', ES: '🇪🇸', IT: '🇮🇹',
  RU: '🇷🇺', PL: '🇵🇱', MX: '🇲🇽', CN: '🇨🇳', XX: '🌐',
};

const CHART_COLORS = ['#0E6E7C', '#C1652E', '#7C3F6B', '#3B5BA5', '#1F8A5F',
  '#3F98A3', '#C97A2B', '#5A5F6B', '#8A6FA8', '#4E8C8C', '#B0784A'];

function TrafficCard({ ct, index }: { ct: CountryTraffic; index: number }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/5">
      <span className="text-xl">{FLAG_EMOJIS[ct.code] || '🌐'}</span>
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-white font-medium">{ct.country}</span>
          <span className="text-violet-light font-bold">{ct.percentage}/100</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${ct.percentage}%`, background: CHART_COLORS[index % CHART_COLORS.length] }} />
        </div>
        <div className="text-xs text-ink-faint mt-0.5">
          {(ct.matchedSignals?.length ?? 0) > 0 ? ct.matchedSignals.join(' · ') : 'No matching signals detected for this region'}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: {payload: CountryTraffic}[] }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="glass border border-violet/30 rounded-xl p-3 text-xs shadow-xl max-w-[220px]">
      <div className="font-bold text-white mb-1">{FLAG_EMOJIS[data.code]} {data.country}</div>
      <div className="text-violet-light font-semibold mb-1">{data.percentage}/100 readiness</div>
      <div className="text-ink-soft">
        {(data.matchedSignals?.length ?? 0) > 0 ? data.matchedSignals.join(', ') : 'No matching signals detected'}
      </div>
    </div>
  );
};

export default function GeoPanel({ geo }: Props) {
  const chartData = geo.trafficEstimates.slice(0, 8);
  const reason = scoreReasonLabel(geo.score);
  const missing: string[] = [];
  if (!geo.hreflang.present) missing.push('no hreflang tags (only one language/region is being served)');
  if (!geo.cdn.detected) missing.push('no CDN detected (slower delivery for visitors far from your server)');
  if (!geo.geographicSignals.countryTLD) missing.push('a generic .com/.io TLD instead of a country-specific domain');

  return (
    <div className="space-y-6 page-enter">
      <div className="panel rounded-xl p-4 flex items-center justify-between flex-wrap gap-2 border-l-4"
        style={{ borderLeftColor: reason.tone === 'good' ? '#1F8A5F' : reason.tone === 'ok' ? '#3B5BA5' : reason.tone === 'warn' ? '#C97A2B' : '#C13B3B' }}>
        <p className="text-sm text-ink-soft">
          Geo score <span className="font-bold text-ink">{geo.score}/100</span> &mdash; <span className="font-semibold text-ink">{reason.label}</span>.{' '}
          {missing.length > 0
            ? <>This is typically the lowest-scoring dimension because most sites only ever build for one market: here that shows up as {missing.join(', ')}.</>
            : 'Regional targeting signals look properly configured for this scan.'}
        </p>
      </div>

      {/* Language & CDN row */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5 border border-violet/10">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={15} className="text-violet-light" />
            <span className="text-sm font-bold text-white">Language</span>
          </div>
          <div className="text-3xl font-black text-violet-light uppercase mb-1">{geo.language.detected || 'Unknown'}</div>
          <div className="text-xs text-ink-soft">
            {geo.language.htmlLang ? `HTML lang="${geo.language.htmlLang}"` : 'HTML lang attribute missing'}
          </div>
          <div className={`mt-2 text-xs font-medium ${geo.language.htmlLang ? 'text-emerald' : 'text-nova'}`}>
            {geo.language.htmlLang ? '✓ Properly declared' : '✗ Not declared in HTML'}
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-violet/10">
          <div className="flex items-center gap-2 mb-3">
            <Wifi size={15} className="text-cyan" />
            <span className="text-sm font-bold text-white">CDN Status</span>
          </div>
          <div className={`text-xl font-black mb-1 ${geo.cdn.detected ? 'text-emerald' : 'text-solar'}`}>
            {geo.cdn.detected ? geo.cdn.provider : 'No CDN Detected'}
          </div>
          <div className={`text-xs font-medium mt-2 ${geo.cdn.detected ? 'text-emerald' : 'text-solar'}`}>
            {geo.cdn.detected ? '✓ Global distribution active' : '⚠ Consider adding a CDN'}
          </div>
        </div>

        <div className="glass rounded-xl p-5 border border-violet/10">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={15} className="text-pink" />
            <span className="text-sm font-bold text-white">Hreflang</span>
          </div>
          <div className={`text-xl font-black mb-1 ${geo.hreflang.present ? 'text-emerald' : 'text-nova'}`}>
            {geo.hreflang.present ? `${geo.hreflang.tags.length} Tags` : 'Not Set'}
          </div>
          {geo.hreflang.present && (
            <div className="flex flex-wrap gap-1 mt-2">
              {geo.hreflang.tags.slice(0, 4).map(t => (
                <span key={t.lang} className="text-xs px-1.5 py-0.5 rounded bg-violet/10 border border-violet/20 text-violet-light font-mono">{t.lang}</span>
              ))}
              {geo.hreflang.tags.length > 4 && <span className="text-xs text-ink-faint">+{geo.hreflang.tags.length - 4}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Geographic signals */}
      <div className="glass rounded-xl p-5 border border-violet/10">
        <h3 className="font-bold text-white mb-4">Geographic Content Signals</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-white/5">
            <div className="text-xs text-ink-soft mb-1">Country TLD</div>
            <div className={`text-sm font-bold ${geo.geographicSignals.countryTLD ? 'text-white' : 'text-ink-faint'}`}>
              {geo.geographicSignals.countryTLD || 'None (.com/.org/.io)'}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <div className="text-xs text-ink-soft mb-1">Currency Symbols</div>
            <div className="text-sm font-bold text-white">
              {geo.geographicSignals.currencySymbols.length > 0
                ? geo.geographicSignals.currencySymbols.join(' ')
                : <span className="text-ink-faint">None detected</span>}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <div className="text-xs text-ink-soft mb-1">Phone Formats</div>
            <div className="text-sm font-bold text-white">
              {geo.geographicSignals.phoneFormats.length > 0
                ? geo.geographicSignals.phoneFormats.join(', ')
                : <span className="text-ink-faint">None detected</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Regional Readiness Chart */}
      <div className="glass rounded-xl p-5 border border-violet/10">
        <h3 className="font-bold text-white mb-1">Regional Readiness</h3>
        <p className="text-xs text-ink-soft mb-1 leading-relaxed">
          This is <span className="text-ink font-medium">not</span> your real visitor traffic \u2014 NEXUS
          isn't connected to your analytics, so it can't see who actually visits your site. What it can see is
          whether the page is technically <em>set up</em> to serve each region well: does the language match,
          is there a matching hreflang tag, does the currency or phone format line up, is there a
          country-specific domain. Each bar is a 0\u2013100 readiness score built only from what this scan
          actually found on your page, so different sites will score very differently here.
        </p>
        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="code" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14,110,124,0.08)' }} />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional readiness breakdown list */}
      <div className="glass rounded-xl p-5 border border-violet/10">
        <h3 className="font-bold text-white mb-4">Regional Readiness Breakdown</h3>
        <div className="space-y-1">
          {geo.trafficEstimates.map((ct, i) => <TrafficCard key={ct.code} ct={ct} index={i} />)}
        </div>
        <p className="text-xs text-ink-faint mt-3 leading-relaxed">
          Want real per-region visitor counts and live engagement instead of a readiness estimate? That
          requires connecting a real data source \u2014 <span className="text-violet-light font-medium">Google
          Analytics / Search Console integration</span> is on the NEXUS Pro roadmap for exactly this.
        </p>
      </div>

      {/* Hreflang table */}
      {geo.hreflang.present && geo.hreflang.tags.length > 0 && (
        <div className="glass rounded-xl border border-violet/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-violet/10">
            <h3 className="font-bold text-white">Hreflang Tags</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-xs text-ink-soft uppercase">
                  <th className="text-left py-2 px-4">Language</th>
                  <th className="text-left py-2 px-4">URL</th>
                </tr>
              </thead>
              <tbody>
                {geo.hreflang.tags.map((tag, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-violet/5">
                    <td className="py-2 px-4"><span className="text-xs font-bold text-violet-light font-mono px-2 py-1 bg-violet/10 rounded">{tag.lang}</span></td>
                    <td className="py-2 px-4 text-xs text-ink-soft font-mono truncate max-w-xs">{tag.href}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Issues & Recs */}
      {geo.issues.length > 0 && (
        <div>
          <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Globe size={16} className="text-solar" /> Geo Issues</h3>
          <IssueList issues={geo.issues} />
        </div>
      )}

      {geo.recommendations.length > 0 && (
        <div>
          <h3 className="font-bold text-white mb-3">Geo Recommendations</h3>
          <div className="space-y-3">
            {geo.recommendations.map((rec, i) => (
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
