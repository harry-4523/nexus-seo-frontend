import { AEOResult } from '../types/analysis.types';
import { CheckCircle, XCircle, AlertCircle, Mic, Star, BookOpen, Users } from 'lucide-react';
import IssueList from './IssueList';
import { scoreReasonLabel } from '../lib/insights';

interface Props { aeo: AEOResult; }

function CheckRow({ label, value, positive = true }: { label: string; value: boolean; positive?: boolean }) {
  const ok = positive ? value : !value;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5">
      <span className="text-sm text-ink">{label}</span>
      {ok
        ? <span className="flex items-center gap-1.5 text-xs font-bold text-emerald"><CheckCircle size={13} /> Yes</span>
        : <span className="flex items-center gap-1.5 text-xs font-bold text-nova/80"><XCircle size={13} /> No</span>}
    </div>
  );
}

function ScoreBar({ label, score, color = 'from-violet to-cyan' }: { label: string; score: number; color?: string }) {
  const textColor = score >= 80 ? 'text-emerald' : score >= 60 ? 'text-cyan' : score >= 40 ? 'text-solar' : 'text-nova';
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-ink-soft">{label}</span>
        <span className={`font-bold ${textColor}`}>{score}/100</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function PotentialBadge({ value }: { value: 'HIGH' | 'MEDIUM' | 'LOW' }) {
  const config = {
    HIGH: 'bg-emerald/10 text-emerald border-emerald/20',
    MEDIUM: 'bg-solar/10 text-solar border-solar/20',
    LOW: 'bg-nova/10 text-nova border-nova/20',
  }[value];
  return <span className={`text-xs font-bold px-3 py-1 rounded-full border ${config}`}>{value} POTENTIAL</span>;
}

function lowestSignal(aeo: AEOResult) {
  const signals: [string, number][] = [
    ['structured data (JSON-LD / FAQ schema)', aeo.structuredData.score],
    ['FAQ content detection', aeo.faqContent.score],
    ['voice search readiness', aeo.voiceSearch.score],
    ['featured snippet potential', aeo.featuredSnippet.score],
    ['E-A-T trust signals', aeo.eatSignals.score],
  ];
  signals.sort((a, b) => a[1] - b[1]);
  return signals[0];
}

export default function AEOPanel({ aeo }: Props) {
  const reason = scoreReasonLabel(aeo.score);
  const [weakest, weakestScore] = lowestSignal(aeo);
  return (
    <div className="space-y-6 page-enter">
      <div className="panel rounded-xl p-4 flex items-center justify-between flex-wrap gap-2 border-l-4"
        style={{ borderLeftColor: reason.tone === 'good' ? '#1F8A5F' : reason.tone === 'ok' ? '#3B5BA5' : reason.tone === 'warn' ? '#C97A2B' : '#C13B3B' }}>
        <p className="text-sm text-ink-soft">
          AEO score <span className="font-bold text-ink">{aeo.score}/100</span> &mdash; <span className="font-semibold text-ink">{reason.label}</span>.{' '}
          AEO tends to lag classic SEO because it depends on markup and phrasing most templates skip by default. The single weakest
          signal here is <span className="font-semibold text-ink">{weakest}</span> at {weakestScore}/100 &mdash; fixing that first will move the score the most.
        </p>
      </div>

      {/* AEO Score Breakdown */}
      <div className="glass rounded-xl p-6 border border-violet/10">
        <h3 className="font-bold text-white mb-5 flex items-center gap-2"><Star size={16} className="text-solar" /> Score Breakdown</h3>
        <ScoreBar label="Structured Data (JSON-LD)" score={aeo.structuredData.score} color="from-violet to-purple-400" />
        <ScoreBar label="FAQ Content Detection" score={aeo.faqContent.score} color="from-cyan-500 to-blue-500" />
        <ScoreBar label="Voice Search Readiness" score={aeo.voiceSearch.score} color="from-pink-500 to-rose-400" />
        <ScoreBar label="Featured Snippet Potential" score={aeo.featuredSnippet.score} color="from-emerald-500 to-teal-400" />
        <ScoreBar label="E-A-T Signals" score={aeo.eatSignals.score} color="from-solar to-orange-400" />
      </div>

      {/* Structured Data */}
      <div className="glass rounded-xl p-6 border border-violet/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white flex items-center gap-2"><BookOpen size={16} className="text-violet-light" /> Structured Data</h3>
          {aeo.structuredData.present
            ? <span className="text-xs font-bold text-emerald bg-emerald/10 px-2 py-0.5 rounded-full border border-emerald/20">Detected</span>
            : <span className="text-xs font-bold text-nova bg-nova/10 px-2 py-0.5 rounded-full border border-nova/20">Missing</span>}
        </div>
        <p className="text-xs text-ink-soft mb-4 leading-relaxed">
          Structured data (JSON-LD) is a hidden block of code that explicitly labels what your content is \u2014
          an FAQ, a recipe, a product, a how-to guide \u2014 instead of making search engines and AI models
          guess from the visible text. It\u2019s the single highest-leverage lever for showing up in AI answer
          engines like ChatGPT and Google\u2019s AI Overviews. A grey "\u2717" below just means that schema type
          wasn\u2019t found; not every page needs every type.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'FAQPage Schema', value: aeo.structuredData.hasFAQ },
            { label: 'HowTo Schema', value: aeo.structuredData.hasHowTo },
            { label: 'Article Schema', value: aeo.structuredData.hasArticle },
            { label: 'BreadcrumbList', value: aeo.structuredData.hasBreadcrumb },
            { label: 'Product Schema', value: aeo.structuredData.hasProduct },
          ].map(({ label, value }) => (
            <div key={label} className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${value ? 'bg-emerald/10 text-emerald border border-emerald/20' : 'bg-white/5 text-ink-faint border border-white/5'}`}>
              {value ? <CheckCircle size={12} /> : <XCircle size={12} />} {label}
            </div>
          ))}
        </div>
        {aeo.structuredData.types.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {aeo.structuredData.types.map(t => (
              <span key={t} className="px-2 py-1 rounded-lg bg-violet/10 border border-violet/20 text-xs text-violet-light font-mono">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Voice Search */}
      <div className="glass rounded-xl p-6 border border-violet/10">
        <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Mic size={16} className="text-cyan" /> Voice Search Optimization</h3>
        <p className="text-xs text-ink-soft mb-4 leading-relaxed">
          This measures how well your content matches what people actually ask a voice assistant or an AI
          chatbot, as opposed to what they'd type into a search box. It checks four things: headings phrased
          as real questions ("What is\u2026", "How do\u2026"), a conversational writing tone, paragraphs that
          answer a question directly in one self-contained chunk, and an answer length in the 20\u201380 word
          sweet spot voice assistants read aloud comfortably. <span className="text-ink font-medium">Question Headings: 0</span> below
          means none of your H1\u2013H4 headings were phrased as a question \u2014 they're likely written as labels
          (e.g. "Features", "Pricing") instead.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-2xl font-black text-cyan">{aeo.voiceSearch.questionHeadings}</div>
            <div className="text-xs text-ink-soft mt-1">Question Headings</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-white/5">
            <div className="text-2xl font-black text-violet-light">{aeo.voiceSearch.avgAnswerLength}</div>
            <div className="text-xs text-ink-soft mt-1">Avg Answer Length (words)</div>
          </div>
        </div>
        <CheckRow label="Conversational tone detected" value={aeo.voiceSearch.hasConversationalContent} />
        <CheckRow label="Direct answer paragraphs" value={aeo.voiceSearch.hasDirectAnswers} />
        <CheckRow label="Question-based headings" value={aeo.voiceSearch.questionHeadings > 0} />
      </div>

      {/* Featured Snippet */}
      <div className="glass rounded-xl p-6 border border-violet/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Featured Snippet Potential</h3>
          <PotentialBadge value={aeo.featuredSnippet.potential} />
        </div>
        <p className="text-xs text-ink-soft mb-4 leading-relaxed">
          Featured snippets are the boxed answer Google shows above the normal results. They\u2019re pulled almost
          exclusively from pages that already use tables, numbered steps, or clear definitions \u2014 the checks below.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Data Tables', value: aeo.featuredSnippet.hasTables },
            { label: 'Ordered Lists', value: aeo.featuredSnippet.hasOrderedLists },
            { label: 'Definitions (dl/dfn)', value: aeo.featuredSnippet.hasDefinitions },
            { label: 'Step-by-step Content', value: aeo.featuredSnippet.hasStepByStep },
          ].map(({ label, value }) => (
            <div key={label} className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium ${value ? 'bg-emerald/10 text-emerald border border-emerald/20' : 'bg-white/5 text-ink-faint border border-white/5'}`}>
              {value ? <CheckCircle size={12} /> : <XCircle size={12} />} {label}
            </div>
          ))}
        </div>
      </div>

      {/* E-A-T Signals */}
      <div className="glass rounded-xl p-6 border border-violet/10">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Users size={16} className="text-pink" /> E-A-T Signals (Expertise, Authoritativeness, Trust)</h3>
        <CheckRow label="About page detected" value={aeo.eatSignals.hasAboutPage} />
        <CheckRow label="Author information present" value={aeo.eatSignals.hasAuthorInfo} />
        <CheckRow label="Contact information found" value={aeo.eatSignals.hasContactInfo} />
        <CheckRow label="Privacy policy linked" value={aeo.eatSignals.hasPrivacyPolicy} />
        <div className="mt-4 p-3 rounded-lg bg-violet/5 border border-violet/10">
          <p className="text-xs text-ink-soft">
            <span className="text-violet-light font-semibold">Why E-A-T matters:</span> Google's Quality Rater Guidelines use Expertise, Authoritativeness, and Trustworthiness to evaluate content quality — especially for YMYL (Your Money, Your Life) topics and AI answer engines.
          </p>
        </div>
      </div>

      {/* Issues */}
      {aeo.issues.length > 0 && (
        <div>
          <h3 className="font-bold text-white mb-3 flex items-center gap-2"><AlertCircle size={16} className="text-solar" /> AEO Issues</h3>
          <IssueList issues={aeo.issues} />
        </div>
      )}

      {/* Recommendations */}
      {aeo.recommendations.length > 0 && (
        <div>
          <h3 className="font-bold text-white mb-3">AEO Recommendations</h3>
          <div className="space-y-3">
            {aeo.recommendations.map((rec, i) => (
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
