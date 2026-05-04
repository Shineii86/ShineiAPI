/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Support — Neo-Brutalist                             ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import Link from 'next/link';
import LegalLayout from '@/components/LegalLayout';

export const metadata = {
  title: 'Support',
  description: 'Get help with ShineiAPI — the free manga, manhwa, and webtoon REST API. FAQs, troubleshooting, and community support.',
};

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="mb-12">
      <div className="flex items-center gap-4 mb-5">
        <span className="w-10 h-10 bg-accent text-primary flex items-center justify-center font-display font-bold text-sm border-2 border-primary shrink-0">
          {number}
        </span>
        <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-primary">
          {title}
        </h2>
      </div>
      <div className="pl-0 md:pl-14 space-y-4 text-stone-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function FAQ({ question, children }) {
  return (
    <div className="p-5 bg-surface-bright border-4 border-primary shadow-brutal">
      <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-3 text-base">
        {question}
      </h3>
      <div className="text-sm text-stone-600 space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <LegalLayout>
          {/* Title */}
          <div className="mb-16">
            <div className="inline-block bg-accent text-primary px-4 py-1.5 border-2 border-primary font-display font-bold text-xs uppercase tracking-widest mb-6 shadow-brutal">
              Help
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter text-primary mb-6">
              Get<br />
              <span className="bg-primary text-white px-4 py-2 border-4 border-primary inline-block transform rotate-1">
                Support
              </span>
            </h1>
            <p className="text-lg text-stone-600 border-l-4 border-accent pl-6 py-2">
              Need help with ShineiAPI? Find answers below or reach out to the community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {[
              { icon: '📖', title: 'Documentation', desc: 'Full API reference with examples', href: '/docs', label: 'Read Docs' },
              { icon: '🐛', title: 'Report a Bug', desc: 'Found something broken? Let us know', href: 'https://github.com/Shineii86/ShineiAPI/issues', label: 'Open Issue', external: true },
              { icon: '💡', title: 'Request a Feature', desc: 'Have an idea? We want to hear it', href: 'https://github.com/Shineii86/ShineiAPI/issues', label: 'Request Feature', external: true },
            ].map((item, i) => (
              <div key={i} className="card-brutal flex flex-col">
                <span className="text-3xl mb-3">{item.icon}</span>
                <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-1">{item.title}</h3>
                <p className="text-sm text-stone-600 mb-4 flex-1">{item.desc}</p>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="btn-brutal-outline !py-2 !px-4 !text-xs w-fit">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="btn-brutal-outline !py-2 !px-4 !text-xs w-fit">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* FAQ */}
          <Section id="faq" number="01" title="Frequently Asked Questions">
            <div className="space-y-4">
              <FAQ question="Do I need an API key?">
                <p>
                  No. ShineiAPI is completely free and requires <strong className="text-primary">zero authentication</strong>.
                  Just make a request and get JSON back. No sign-ups, no API keys, no OAuth.
                </p>
              </FAQ>

              <FAQ question="What are the rate limits?">
                <p>
                  <strong className="text-primary">60 requests per minute</strong> per IP address. Rate limit info is included
                  in every response via <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">X-RateLimit-Limit</code>,{' '}
                  <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">X-RateLimit-Remaining</code>, and{' '}
                  <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">Retry-After</code> headers.
                </p>
              </FAQ>

              <FAQ question="I'm getting a 429 error — what do I do?">
                <p>
                  You've hit the rate limit. Wait for the window to reset (check the{' '}
                  <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">Retry-After</code> header)
                  or implement request throttling in your app. If you need higher limits,{' '}
                  <a href="https://github.com/Shineii86/ShineiAPI/issues" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">open an issue</a>.
                </p>
              </FAQ>

              <FAQ question="How often is the data updated?">
                <p>
                  Data comes from the <a href="https://toraka.com" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">Toraka</a> API.
                  ShineiAPI caches responses for 5–15 minutes depending on the endpoint. Series data refreshes every
                  5 minutes, search results every 10 minutes, and rankings every 15 minutes.
                </p>
              </FAQ>

              <FAQ question="Can I use ShineiAPI in my commercial project?">
                <p>
                  Yes. The API is free to use. The source code is{' '}
                  <a href="https://github.com/Shineii86/ShineiAPI/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">MIT licensed</a>.
                  However, you may not resell the API itself or charge users for direct access to ShineiAPI.
                </p>
              </FAQ>

              <FAQ question="Why is a series missing or returning wrong data?">
                <p>
                  ShineiAPI pulls data from Toraka. If a series is missing or incorrect, it's likely an upstream issue.
                  You can{' '}
                  <a href="https://github.com/Shineii86/ShineiAPI/issues" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">report it on GitHub</a>{' '}
                  and we'll investigate. Include the series slug in your report.
                </p>
              </FAQ>

              <FAQ question="Does ShineiAPI support CORS?">
                <p>
                  Yes. <strong className="text-primary">All origins are allowed.</strong> You can call the API directly from
                  any browser, mobile app, desktop app, or browser extension without a proxy.
                </p>
              </FAQ>

              <FAQ question="How do I get the cover image for a series?">
                <p>
                  The <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">cover</code> field
                  in series responses contains the full URL to the cover image. Use it directly in an{' '}
                  <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">&lt;img&gt;</code> tag
                  or fetch it server-side.
                </p>
              </FAQ>
            </div>
          </Section>

          {/* Common Issues */}
          <Section id="troubleshooting" number="02" title="Troubleshooting">
            <div className="space-y-4">
              <div className="p-5 bg-surface-bright border-4 border-primary shadow-brutal">
                <h3 className="font-display font-bold text-secondary uppercase tracking-tight mb-2 text-sm">
                  CORS Errors in Browser
                </h3>
                <p className="text-sm text-stone-600">
                  ShineiAPI sets <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">Access-Control-Allow-Origin: *</code> on all responses.
                  If you're still getting CORS errors, check that you're hitting <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">https://shineiapi.vercel.app</code> (not http).
                </p>
              </div>

              <div className="p-5 bg-surface-bright border-4 border-primary shadow-brutal">
                <h3 className="font-display font-bold text-secondary uppercase tracking-tight mb-2 text-sm">
                  404 — Series Not Found
                </h3>
                <p className="text-sm text-stone-600">
                  The slug must match exactly. Try{' '}
                  <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">/api/v1/search?q=title</code>{' '}
                  first to find the correct slug, then use it in{' '}
                  <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">/api/v1/series/{'{slug}'}</code>.
                </p>
              </div>

              <div className="p-5 bg-surface-bright border-4 border-primary shadow-brutal">
                <h3 className="font-display font-bold text-secondary uppercase tracking-tight mb-2 text-sm">
                  Slow Responses
                </h3>
                <p className="text-sm text-stone-600">
                  First request to an uncached endpoint may be slower (upstream fetch). Subsequent requests within
                  the TTL window are served from cache in milliseconds. If responses are consistently slow, check{' '}
                  <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">/api/v1/health</code>{' '}
                  for upstream status.
                </p>
              </div>

              <div className="p-5 bg-surface-bright border-4 border-primary shadow-brutal">
                <h3 className="font-display font-bold text-secondary uppercase tracking-tight mb-2 text-sm">
                  Empty or Malformed Responses
                </h3>
                <p className="text-sm text-stone-600">
                  Always check the <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">success</code> field
                  in the response envelope. If <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">success: false</code>,
                  the <code className="bg-surface-dim px-1.5 py-0.5 border border-primary text-xs font-mono">error</code> field contains details.
                </p>
              </div>
            </div>
          </Section>

          {/* Status */}
          <Section id="status" number="03" title="API Status">
            <p>
              Check the health of the API and its upstream dependency:
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <a
                href="https://shineiapi.vercel.app/api/v1/health"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-bold uppercase text-xs tracking-widest bg-primary text-white px-6 py-3 border-4 border-primary hover:bg-accent hover:text-primary active:translate-y-1 active:translate-x-1 transition-all shadow-brutal text-center"
              >
                Health Check
              </a>
              <a
                href="https://shineiapi.vercel.app/api/v1/stats"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-bold uppercase text-xs tracking-widest bg-surface text-primary px-6 py-3 border-4 border-primary hover:bg-accent active:translate-y-1 active:translate-x-1 transition-all shadow-brutal text-center"
              >
                API Stats
              </a>
            </div>
          </Section>

          {/* Community */}
          <Section id="community" number="04" title="Community & Contact">
            <p>
              ShineiAPI is open source and community-driven. The best way to get help is through GitHub:
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'GitHub Issues', desc: 'Report bugs, request features, ask questions', href: 'https://github.com/Shineii86/ShineiAPI/issues' },
                { title: 'GitHub Discussions', desc: 'Community conversations and help', href: 'https://github.com/Shineii86/ShineiAPI/discussions' },
                { title: 'Source Code', desc: 'Fork, contribute, or learn from the code', href: 'https://github.com/Shineii86/ShineiAPI' },
                { title: 'Changelog', desc: 'See what\'s new in each release', href: 'https://github.com/Shineii86/ShineiAPI/blob/main/CHANGELOG.md' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 bg-surface-bright border-4 border-primary shadow-brutal hover:-translate-y-1 transition-all group"
                >
                  <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-1 group-hover:text-secondary transition-colors">{item.title}</h3>
                  <p className="text-sm text-stone-600">{item.desc}</p>
                </a>
              ))}
            </div>
          </Section>

          {/* Cross-links */}
          <div className="mt-16 pt-8 border-t-4 border-primary flex flex-wrap gap-4">
            <Link href="/docs" className="btn-brutal inline-flex">
              API Documentation <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link href="/terms" className="btn-brutal-outline inline-flex">
              Terms of Service
            </Link>
            <Link href="/privacy" className="btn-brutal-outline inline-flex">
              Privacy Policy
            </Link>
          </div>
    </LegalLayout>
  );
}
