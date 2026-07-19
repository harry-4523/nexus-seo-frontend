import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, Search, Brain, Globe, Shield, Check, Lock,
  LineChart, Users, Bell, FileDown, Repeat, KeyRound,
  Wrench, Sparkles, Link2, ImagePlus,
} from 'lucide-react';
import Hero3D from '../components/Hero3D';
import { useAnalysisStore } from '../store/analysis.store';
import { analyzeUrl } from '../api/client';

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    id: '01', icon: <Search className="w-5 h-5" />, color: '#0E6E7C', title: 'SEO',
    tagline: 'Whether Google can find and understand your page.',
    body: 'We check your titles, meta descriptions, heading structure, internal linking, image alt text, and schema markup — the same signals search engines use to decide if your page deserves to rank.',
    why: 'A weak title tag or a missing H1 is often the single biggest reason a page that deserves to rank on page one sits on page three instead.',
  },
  {
    id: '02', icon: <Brain className="w-5 h-5" />, color: '#7C3F6B', title: 'AEO',
    tagline: 'Whether AI answer engines can quote you.',
    body: 'ChatGPT, Perplexity, and Google\u2019s AI Overviews pull answers from pages that are structured like answers: FAQ schema, question-based headings, clear author credentials, and direct, quotable statements.',
    why: 'Two sites can rank identically in classic search and still get completely different treatment from AI search — this is the newest, fastest-growing gap in visibility.',
  },
  {
    id: '03', icon: <Globe className="w-5 h-5" />, color: '#C1652E', title: 'Geo Engagement',
    tagline: 'Whether the right countries and languages are served correctly.',
    body: 'We look at hreflang tags, declared language, currency and phone formats, CDN coverage, and where your traffic is likely concentrated — the plumbing that decides whether a visitor in Mumbai or Munich gets the right version of your site.',
    why: 'A missing hreflang tag can cause Google to show the wrong-language version of your page to an entire country, quietly capping your growth there.',
  },
  {
    id: '04', icon: <Shield className="w-5 h-5" />, color: '#3B5BA5', title: 'Technical Audit',
    tagline: 'Whether the site is fast, secure, and crawlable.',
    body: 'Core Web Vitals, SSL, security headers, mobile responsiveness, compression, and crawlability — the infrastructure layer that search engines factor into ranking regardless of how good your content is.',
    why: 'Google has confirmed page speed and Core Web Vitals are ranking factors — a slow site can outrank nobody, no matter how good the writing is.',
  },
];

const PRO_FEATURES = [
  { icon: <Wrench size={18} />, title: 'One-click auto-fix', desc: 'For fixable issues (missing meta tags, sitemap, robots.txt, alt text), generate the exact code patch instead of just naming the problem.' },
  { icon: <Sparkles size={18} />, title: 'AI alt-text & meta writer', desc: 'Automatically draft descriptive alt text, titles, and meta descriptions for every page that\u2019s missing them, ready to paste in.' },
  { icon: <Link2 size={18} />, title: 'Broken link & 404 scanner', desc: 'Crawl every internal and outbound link on the site and flag dead links before they cost you rankings or visitors.' },
  { icon: <LineChart size={18} />, title: 'Rank tracking over time', desc: 'Daily position tracking across Google, Bing, and AI answer engines for your target keywords, charted week over week.' },
  { icon: <Users size={18} />, title: 'Competitor benchmarking', desc: 'Run the same audit on up to 5 competitors and see exactly which signals are giving them the edge over you.' },
  { icon: <Bell size={18} />, title: 'Monitoring & alerts', desc: 'Automatic re-scans on a schedule, with email or Slack alerts the moment your score drops or a page goes down.' },
  { icon: <FileDown size={18} />, title: 'White-label PDF reports', desc: 'Client-ready, branded reports — built for agencies and consultants who report to their own clients.' },
  { icon: <Repeat size={18} />, title: 'Full-site crawl', desc: 'Audit every page on a domain in one pass instead of one URL at a time, with a site-wide health rollup.' },
  { icon: <ImagePlus size={18} />, title: 'Image weight optimizer', desc: 'Detect oversized, uncompressed images dragging down LCP and generate compressed WebP/AVIF replacements.' },
  { icon: <KeyRound size={18} />, title: 'API access', desc: 'Pull scores and issues programmatically into your own dashboards, CI pipeline, or client portal.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const proRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const { setCurrentResult, setIsAnalyzing, setAnalysisError, setAnalysisProgress } = useAnalysisStore();

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo('.hero-badge', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .fromTo('.hero-h1 span', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, '-=0.2')
      .fromTo('.hero-sub', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .fromTo('.hero-input', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .fromTo('.hero-cta', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 }, '-=0.2');

    gsap.fromTo('.pillar-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: pillarsRef.current, start: 'top 80%', once: true } }
    );

    gsap.fromTo('.pro-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: proRef.current, start: 'top 85%', once: true } }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  const handleAnalyze = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim()) { inputRef.current?.focus(); return; }
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;

    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      setCurrentResult(null);

      const stages: [number, string][] = [
        [10, 'Launching browser...'], [25, 'Navigating to page...'],
        [45, 'Scraping content...'], [60, 'Analyzing SEO factors...'],
        [72, 'Running AEO checks...'], [83, 'Detecting geo signals...'],
        [92, 'Technical audit...'], [98, 'Compiling report...'],
      ];

      let stageIdx = 0;
      const progressInterval = setInterval(() => {
        if (stageIdx < stages.length) {
          const [p, s] = stages[stageIdx];
          setAnalysisProgress(p, s);
          stageIdx++;
        }
      }, 2500);

      const data = await analyzeUrl(finalUrl);
      clearInterval(progressInterval);
      setAnalysisProgress(100, 'Complete!');
      setCurrentResult(data.data);
      setTimeout(() => { navigate(`/results/${data.data.scanId}`); }, 600);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Analysis failed. Please try again.';
      setAnalysisError(msg);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative bg-void">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        <Hero3D />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-void pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-void to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-border text-xs font-mono uppercase tracking-wider text-ink-soft mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
            Real browser scans &middot; no login required
          </div>

          <div className="hero-h1 overflow-hidden mb-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-ink">
              <span className="inline-block">See your website</span>{' '}
              <br className="hidden md:block" />
              <span className="inline-block">the way </span>
              <span className="inline-block gradient-text">search engines</span>{' '}
              <span className="inline-block">do.</span>
            </h1>
          </div>

          <p className="hero-sub max-w-2xl mx-auto text-lg text-ink-soft leading-relaxed mb-10">
            NEXUS scores any URL across four dimensions &mdash; <span className="text-ink font-medium">SEO</span>,{' '}
            <span className="text-ink font-medium">AEO</span>, <span className="text-ink font-medium">geographic reach</span>, and{' '}
            <span className="text-ink font-medium">technical health</span> &mdash; and tells you exactly what's holding your
            ranking back, and how to fix it.
          </p>

          <form onSubmit={handleAnalyze} className="hero-input max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center glass rounded-xl overflow-hidden border border-border shadow-sm">
              <div className="flex items-center pl-5 pr-3 text-ink-faint">
                <Search size={18} />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="yourwebsite.com"
                className="flex-1 bg-transparent py-4 pr-4 text-ink placeholder-ink-faint text-base outline-none font-mono"
              />
              <button
                type="submit"
                className="m-2 px-6 py-3 rounded-lg bg-ink text-[#F7F7F4] font-semibold text-sm flex items-center gap-2 hover:bg-violet transition-all duration-300"
              >
                Analyze <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="hero-cta flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-soft mb-4">
            {['Real Puppeteer scraping', '30-second scan', 'Instant PDF report'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={13} className="text-emerald" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars intro divider */}
      <div className="border-y border-border bg-cosmos py-3">
        <p className="text-center text-xs font-mono text-ink-faint uppercase tracking-widest">
          Every scan checks the same real signals below \u2014 nothing on this page is a placeholder number
        </p>
      </div>

      {/* Explainer: the four pillars */}
      <section ref={pillarsRef} className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs uppercase tracking-widest text-violet mb-3">How scoring works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Four questions decide whether people find you.
            </h2>
            <p className="text-ink-soft text-lg leading-relaxed">
              Search visibility isn't one number. It's four separate systems — classic search, AI answer
              engines, geographic delivery, and technical infrastructure — each with its own rules. NEXUS
              scores all four independently so you know exactly which one is costing you traffic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PILLARS.map(({ id, icon, color, title, tagline, body, why }) => (
              <div key={id} className="pillar-card panel rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ background: color }}>
                    {icon}
                  </div>
                  <div>
                    <span className="font-mono text-xs text-ink-faint">{id}</span>
                    <h3 className="text-ink font-bold text-lg leading-tight">{title}</h3>
                  </div>
                </div>
                <p className="text-ink font-medium mb-2">{tagline}</p>
                <p className="text-ink-soft text-sm leading-relaxed mb-4">{body}</p>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-ink-soft leading-relaxed">
                    <span className="font-semibold" style={{ color }}>Why it matters &mdash; </span>{why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro features upsell */}
      <section ref={proRef} className="relative py-24 px-6 bg-cosmos border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-6 mb-14">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-widest text-violet mb-3">NEXUS Pro</p>
              <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
                The free scan tells you what's wrong. Pro keeps it fixed.
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed">
                Most audit tools charge a monthly subscription just to unlock the features below. We're
                building them in as an upgrade path, not a paywall on the basics.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-ink-soft">
              <Lock size={14} /> Coming soon &mdash; join the waitlist from your dashboard
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRO_FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="pro-card panel rounded-xl p-6 glass-hover">
                <div className="w-9 h-9 rounded-lg bg-violet/10 text-violet flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="text-ink font-semibold mb-1.5">{title}</h3>
                <p className="text-ink-soft text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-ink mb-5">
            Run your first audit in the next 30 seconds.
          </h2>
          <p className="text-ink-soft text-lg mb-10">
            Paste any URL. No account, no credit card, no waiting.
          </p>
          <button onClick={() => navigate('/analyze')}
            className="btn-primary text-base px-8 py-4 flex items-center gap-3 mx-auto">
            Start free analysis <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-ink-faint text-sm">
          <div className="flex items-center gap-2">
            <span className="text-ink font-bold font-display">NEXUS</span>
            <span>&mdash; Website Intelligence Platform</span>
          </div>
          <p className="font-mono text-xs">React &middot; Three.js &middot; GSAP &middot; Node.js &middot; PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}
