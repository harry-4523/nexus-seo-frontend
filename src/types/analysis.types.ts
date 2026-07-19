export interface KeywordData {
  keyword: string; count: number; density: number;
  inTitle: boolean; inH1: boolean; inMeta: boolean;
}
export interface Issue { type: 'ERROR' | 'WARNING' | 'INFO'; message: string; category: string; }
export interface Recommendation { priority: 'HIGH' | 'MEDIUM' | 'LOW'; title: string; description: string; impact: string; category: string; }
export interface SEOResult {
  score: number;
  title: { value: string; length: number; score: number; issues: string[] };
  metaDescription: { value: string; length: number; score: number; issues: string[] };
  headings: { h1: string[]; h2: string[]; h3: string[]; score: number; issues: string[] };
  keywords: KeywordData[];
  links: { internal: number; external: number; broken: number; score: number };
  images: { total: number; withAlt: number; withoutAlt: number; score: number };
  openGraph: { present: boolean; tags: Record<string, string>; score: number };
  twitterCard: { present: boolean; tags: Record<string, string>; score: number };
  canonical: { present: boolean; url: string; score: number };
  robots: { meta: string; score: number };
  schema: { present: boolean; types: string[]; score: number };
  wordCount: number; readabilityScore: number;
  issues: Issue[]; recommendations: Recommendation[];
}
export interface AEOResult {
  score: number;
  structuredData: { present: boolean; types: string[]; hasFAQ: boolean; hasHowTo: boolean; hasArticle: boolean; hasBreadcrumb: boolean; hasProduct: boolean; score: number };
  faqContent: { detected: boolean; count: number; score: number };
  voiceSearch: { score: number; hasConversationalContent: boolean; hasDirectAnswers: boolean; questionHeadings: number; avgAnswerLength: number };
  featuredSnippet: { potential: 'HIGH' | 'MEDIUM' | 'LOW'; score: number; hasTables: boolean; hasOrderedLists: boolean; hasDefinitions: boolean; hasStepByStep: boolean };
  eatSignals: { hasAboutPage: boolean; hasAuthorInfo: boolean; hasContactInfo: boolean; hasPrivacyPolicy: boolean; score: number };
  issues: Issue[]; recommendations: Recommendation[];
}
export interface HreflangTag { lang: string; href: string; }
export interface CountryTraffic { country: string; code: string; percentage: number; matchedSignals: string[]; }
export interface GeoResult {
  score: number;
  language: { detected: string; htmlLang: string; score: number };
  hreflang: { present: boolean; tags: HreflangTag[]; score: number };
  geographicSignals: { countryTLD: string | null; currencySymbols: string[]; phoneFormats: string[]; score: number };
  cdn: { detected: boolean; provider: string | null; score: number };
  trafficEstimates: CountryTraffic[];
  issues: Issue[]; recommendations: Recommendation[];
}
export interface SecurityHeader { name: string; present: boolean; value?: string; importance: 'HIGH' | 'MEDIUM' | 'LOW'; }
export interface TechnicalResult {
  score: number;
  ssl: { enabled: boolean; score: number };
  performance: { loadTime: number; pageSize: number; score: number; coreWebVitals: { lcp: number; fid: number; cls: number; lcpScore: string; fidScore: string; clsScore: string } };
  mobile: { hasViewportMeta: boolean; isResponsive: boolean; score: number };
  security: { headers: SecurityHeader[]; score: number };
  crawlability: { hasRobotsTxt: boolean; hasSitemap: boolean; isIndexable: boolean; score: number };
  accessibility: { hasSkipLinks: boolean; hasAriaLabels: boolean; hasAltTexts: boolean; score: number };
  compression: { enabled: boolean; type: string | null; score: number };
  issues: Issue[]; recommendations: Recommendation[];
}
export interface AnalysisResult {
  url: string; domain: string; scanId: string; overallScore: number;
  seo: SEOResult; aeo: AEOResult; geo: GeoResult; technical: TechnicalResult;
  scannedAt: string; duration: number;
}
export interface User { id: string; email: string; name?: string; role: string; }
export interface ScanSummary {
  id: string; url: string; domain: string; overallScore: number;
  seoScore: number; aeoScore: number; geoScore: number; techScore: number;
  duration: number; createdAt: string;
}
