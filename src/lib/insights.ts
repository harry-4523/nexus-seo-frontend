// Human-readable "why this happened" + "how to fix it" copy for the raw
// issue strings the backend returns. Matched by keyword since issues are
// free-text messages, not coded enums.

export interface IssueInsight { cause: string; fix: string; }

const RULES: { test: RegExp; cause: string; fix: string }[] = [
  {
    test: /no h1|missing h1|h1 heading/i,
    cause: 'The page has no single, clear <h1> tag. This usually happens when a design uses styled <div>s or <h2>s for the main headline instead of a real heading element, or when the CMS template omits one.',
    fix: 'Add exactly one <h1> near the top of the page that states what the page is about in plain language, and include your primary keyword naturally.',
  },
  {
    test: /meta description/i,
    cause: 'Either no <meta name="description"> tag was written, or it falls outside the length search engines display well (roughly 80\u2013165 characters).',
    fix: 'Write a unique, one-sentence summary of the page for every template, aiming for 120\u2013160 characters that includes the main keyword and a reason to click.',
  },
  {
    test: /title/i,
    cause: 'The <title> tag is missing, duplicated across pages, or outside the readable range search results truncate to (roughly 30\u201370 characters).',
    fix: 'Give each page a unique title under 60 characters: primary keyword first, brand name last, separated by a dash or pipe.',
  },
  {
    test: /alt text|image.*alt|alt attribute/i,
    cause: 'Images were uploaded without descriptive alt attributes \u2014 common when images are added directly through a CMS media library without editing accessibility fields.',
    fix: 'Add a short, descriptive alt attribute to every meaningful image (what it shows, not "image123.jpg"); leave alt="" only for purely decorative images.',
  },
  {
    test: /canonical/i,
    cause: 'No canonical URL was set, which usually happens on sites where the same content is reachable through more than one URL (with/without trailing slash, tracking parameters, http vs https).',
    fix: 'Add a self-referencing <link rel="canonical"> tag on every page pointing to its preferred URL, so search engines don\u2019t split ranking signals across duplicates.',
  },
  {
    test: /schema|structured data/i,
    cause: 'No JSON-LD structured data block was found in the page source. This is typically skipped because it requires manual markup that most page builders don\u2019t add by default.',
    fix: 'Add JSON-LD schema matching your content type (Article, Product, LocalBusiness, FAQPage) inside a <script type="application/ld+json"> tag in the <head>.',
  },
  {
    test: /faq/i,
    cause: 'No FAQPage structured data was detected, even if the page has question-and-answer style content visually \u2014 the schema has to be explicitly marked up, it isn\u2019t inferred from visible text.',
    fix: 'Wrap your existing Q&A content in FAQPage JSON-LD schema. This is also one of the highest-leverage fixes for showing up in AI answer engines.',
  },
  {
    test: /question-based heading|question heading/i,
    cause: 'Your H2/H3 headings are phrased as labels ("Features", "Pricing") rather than as the actual questions a reader or an AI model would type.',
    fix: 'Rephrase key headings as real questions \u2014 "What does X cost?" instead of "Pricing" \u2014 and answer them directly in the following sentence.',
  },
  {
    test: /author/i,
    cause: 'No visible author name, bio, or credentials were found on the page. Search engines use this as an E-E-A-T (experience, expertise, authority, trust) signal, especially for advice-style content.',
    fix: 'Add a visible author byline with a short bio and a link to an author or about page for every article.',
  },
  {
    test: /hreflang/i,
    cause: 'No hreflang tags were found, which means the site either only targets one language/region or the multi-language setup is missing the tags that tell search engines about it.',
    fix: 'Add <link rel="alternate" hreflang="..."> tags for every language/region variant of the page, including a matching x-default for the fallback version.',
  },
  {
    test: /sitemap/i,
    cause: 'No XML sitemap was found at the expected location, which makes it harder for search engine crawlers to discover every page, especially on larger or newer sites.',
    fix: 'Generate a sitemap.xml listing your key URLs, reference it in robots.txt, and submit it in Google Search Console.',
  },
  {
    test: /robots\.txt/i,
    cause: 'No robots.txt file was found at the domain root, so crawlers fall back to default behavior rather than following any explicit crawl rules you intend.',
    fix: 'Add a robots.txt file at the root of the domain that allows crawling of public pages and references your sitemap.',
  },
  {
    test: /lcp|largest contentful paint/i,
    cause: 'Largest Contentful Paint measures how long the biggest visible element (usually a hero image or heading) takes to render. Slow LCP is almost always caused by large unoptimized images, render-blocking CSS/JS, or slow server response time.',
    fix: 'Compress and lazy-load below-the-fold images, serve modern formats like WebP/AVIF, preload the hero image, and remove unused render-blocking scripts.',
  },
  {
    test: /fid|first input delay|inp/i,
    cause: 'A slow First Input Delay/Interaction means heavy JavaScript is blocking the main thread when a visitor tries to click or type, usually from large bundles or third-party scripts running on load.',
    fix: 'Break up long JavaScript tasks, defer non-critical scripts, and audit third-party tags (ads, chat widgets, analytics) for ones that can load later.',
  },
  {
    test: /cls|cumulative layout shift/i,
    cause: 'Layout shift happens when elements without reserved space (images, ads, fonts, embeds) push content around as the page loads.',
    fix: 'Set explicit width/height on images and embeds, reserve space for ads, and preload custom fonts to prevent layout jumps.',
  },
  {
    test: /x-frame-options/i,
    cause: 'This header wasn\u2019t sent by the server, leaving the site more exposed to clickjacking, where another site embeds it in a hidden iframe to trick users into clicking it.',
    fix: 'Set X-Frame-Options: SAMEORIGIN (or a matching frame-ancestors directive in your Content-Security-Policy) at the server or CDN level.',
  },
  {
    test: /referrer-policy/i,
    cause: 'No Referrer-Policy header is set, so the browser falls back to sending full referrer URLs to third parties by default \u2014 which can leak sensitive path or query data.',
    fix: 'Set Referrer-Policy: strict-origin-when-cross-origin to balance analytics accuracy with not leaking full URLs to external sites.',
  },
  {
    test: /permissions-policy/i,
    cause: 'No Permissions-Policy header is set, meaning the browser doesn\u2019t explicitly restrict which features (camera, microphone, geolocation) embedded content is allowed to request.',
    fix: 'Add a Permissions-Policy header that disables browser features your site doesn\u2019t use, reducing what a compromised third-party script could access.',
  },
  {
    test: /ssl|https/i,
    cause: 'The site is being served without a valid SSL certificate, so browsers mark it as "Not secure" and it\u2019s effectively excluded from ranking well, since HTTPS is a confirmed baseline ranking signal.',
    fix: 'Install a certificate (a free one from Let\u2019s Encrypt works) and force-redirect all HTTP traffic to HTTPS.',
  },
  {
    test: /viewport/i,
    cause: 'No responsive viewport meta tag was found, so mobile browsers render the page at desktop width and then shrink it \u2014 a strong negative signal for mobile-first indexing.',
    fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the <head> of every page.',
  },
  {
    test: /compression|gzip|brotli/i,
    cause: 'The server isn\u2019t compressing responses before sending them, so every visitor downloads more bytes than necessary \u2014 usually a default server/CDN setting that was never enabled.',
    fix: 'Enable Gzip or, preferably, Brotli compression at the server or CDN level for text-based assets (HTML, CSS, JS).',
  },
];

const DEFAULT_INSIGHT: IssueInsight = {
  cause: 'This was flagged against the standard best-practice check for this signal, based on what an automated scan of the page found (or didn\u2019t find).',
  fix: 'Review the flagged element manually against current search engine guidelines and update it to match best practice.',
};

export function getIssueInsight(message: string): IssueInsight {
  for (const rule of RULES) {
    if (rule.test.test(message)) return { cause: rule.cause, fix: rule.fix };
  }
  return DEFAULT_INSIGHT;
}

// Category-level "why is this score what it is" summaries.
export function scoreReasonLabel(score: number): { label: string; tone: 'good' | 'ok' | 'warn' | 'bad' } {
  if (score >= 80) return { label: 'Strong', tone: 'good' };
  if (score >= 60) return { label: 'Workable, with gaps', tone: 'ok' };
  if (score >= 40) return { label: 'Holding you back', tone: 'warn' };
  return { label: 'Critical weak point', tone: 'bad' };
}
