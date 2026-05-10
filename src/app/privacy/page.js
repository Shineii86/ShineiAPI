/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Privacy Policy — Neo-Brutalist                      ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import Link from 'next/link';
import LegalLayout from '@/components/LegalLayout';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for ShineiAPI — the free manga, manhwa, and webtoon REST API.',
};

const lastUpdated = 'May 3, 2026';

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="mb-12">
      <div className="flex items-center gap-4 mb-5">
        <span className="w-10 h-10 bg-tertiary text-white flex items-center justify-center font-display font-bold text-sm border-2 border-primary shrink-0">
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

export default function PrivacyPage() {
  return (
    <LegalLayout>
          {/* Title */}
          <div className="mb-16">
            <div className="inline-block bg-tertiary text-white px-4 py-1.5 border-2 border-primary font-display font-bold text-xs uppercase tracking-widest mb-6 shadow-brutal">
              Legal
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter text-primary mb-6">
              Privacy<br />
              <span className="bg-primary text-white px-4 py-2 border-4 border-primary inline-block transform rotate-1">
                Policy
              </span>
            </h1>
            <p className="text-lg text-stone-600 border-l-4 border-tertiary pl-6 py-2">
              Your privacy matters. This policy explains what data we collect and how we use it.
              Last updated: <strong className="text-primary">{lastUpdated}</strong>
            </p>
          </div>

          {/* Sections */}
          <Section id="overview" number="01" title="Overview">
            <p>
              ShineiAPI (&quot;we&quot;, &quot;us&quot;, &quot;the Service&quot;) is a free, public REST API for manga, manhwa,
              and webtoon data. We are committed to protecting your privacy. This Privacy Policy explains
              our practices regarding data collection, use, and disclosure when you use our Service.
            </p>
            <div className="mt-6 p-6 bg-accent/10 border-4 border-primary shadow-brutal">
              <p className="font-display font-bold text-primary uppercase tracking-wide mb-2">
                TL;DR — We collect almost nothing.
              </p>
              <p className="text-stone-700 text-sm">
                ShineiAPI does not require authentication, does not use cookies for tracking, does not sell your data,
                and collects only minimal server logs necessary for operation and abuse prevention.
              </p>
            </div>
          </Section>

          <Section id="collection" number="02" title="Information We Collect">
            <p>When you use ShineiAPI, we may collect the following information:</p>

            <div className="mt-6 space-y-4">
              <div className="p-5 bg-surface-bright border-4 border-primary shadow-brutal">
                <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-2">
                  Server Log Data
                </h3>
                <p className="text-sm text-stone-600">
                  Our hosting provider (Vercel) automatically collects standard server logs, which may include:
                </p>
                <ul className="list-none mt-3 space-y-2">
                  {[
                    'IP address (used for rate limiting, not stored permanently)',
                    'Browser user-agent string',
                    'Requested URL path and query parameters',
                    'HTTP method and response status code',
                    'Timestamp of the request',
                    'Referrer URL (if provided by your browser)',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="w-4 h-4 bg-tertiary text-white flex items-center justify-center text-[10px] font-bold border border-primary shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-surface-bright border-4 border-primary shadow-brutal">
                <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-2">
                  Rate Limiting Data
                </h3>
                <p className="text-sm text-stone-600">
                  To enforce rate limits (60 requests per minute), we temporarily track request counts per IP address
                  in server memory. This data is ephemeral and is automatically purged when the rate limit window
                  resets. It is not persisted to any database.
                </p>
              </div>

              <div className="p-5 bg-surface-bright border-4 border-primary shadow-brutal">
                <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-2">
                  Cache Data
                </h3>
                <p className="text-sm text-stone-600">
                  API responses are cached in server memory for 2–15 minutes to improve performance. Cached data
                  contains only API response content (manga/manhwa metadata) and is not associated with any user
                  identifier. Cache entries are automatically evicted based on TTL.
                </p>
              </div>
            </div>
          </Section>

          <Section id="no-collect" number="03" title="Information We Do NOT Collect">
            <p>ShineiAPI does not collect or store:</p>
            <ul className="list-none space-y-3 mt-4">
              {[
                'Personal identification information (name, email, phone)',
                'Authentication credentials (API keys, tokens, passwords)',
                'Cookies for tracking or analytics purposes',
                'Payment or financial information',
                'Device fingerprints or persistent identifiers',
                'Location data beyond IP-derived geolocation (not stored)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green text-white flex items-center justify-center text-xs font-bold border-2 border-primary shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="usage" number="04" title="How We Use Information">
            <p>The limited information we collect is used solely for:</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Service Operation', desc: 'Processing API requests and returning manga/manhwa data' },
                { title: 'Rate Limiting', desc: 'Enforcing fair usage limits to ensure availability for all users' },
                { title: 'Abuse Prevention', desc: 'Identifying and blocking malicious traffic or DDoS attempts' },
                { title: 'Performance', desc: 'Caching responses to reduce latency and upstream load' },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-surface-dim border-4 border-primary">
                  <h3 className="font-display font-bold text-sm uppercase tracking-tight text-primary mb-1">{item.title}</h3>
                  <p className="text-xs text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="sharing" number="05" title="Data Sharing & Third Parties">
            <p>
              We do not sell, trade, or rent your information to third parties. We may share limited data
              with the following service providers solely for Service operation:
            </p>
            <div className="mt-4 p-5 bg-surface-bright border-4 border-primary shadow-brutal">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display font-bold text-primary uppercase tracking-tight text-sm">Vercel (Hosting)</h3>
                  <p className="text-sm text-stone-600 mt-1">
                    Our Service is hosted on Vercel. Server logs (including IP addresses) are processed by Vercel
                    in accordance with their{' '}
                    <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">Privacy Policy</a>.
                  </p>
                </div>
                <div className="border-t border-primary/10 pt-4">
                  <h3 className="font-display font-bold text-primary uppercase tracking-tight text-sm">Toraka (Data Source)</h3>
                  <p className="text-sm text-stone-600 mt-1">
                    API requests are proxied to the Toraka API for manga/manhwa data. Request patterns may be
                    visible to Toraka. See{' '}
                    <a href="https://toraka.com" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">Toraka&apos;s policies</a>{' '}
                    for details.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section id="cookies" number="06" title="Cookies & Tracking">
            <p>
              ShineiAPI does <strong className="text-primary">not</strong> use cookies, web beacons, tracking pixels,
              or any similar tracking technologies. The API is a stateless REST service — each request is
              independent and we do not maintain user sessions.
            </p>
            <p>
              The ShineiAPI website (shineiapi.vercel.app) may use <code className="bg-surface-dim px-2 py-0.5 border border-primary text-xs font-mono">localStorage</code>{' '}
              to store your theme preference (light/dark mode). This data stays on your device and is never
              transmitted to our servers.
            </p>
          </Section>

          <Section id="retention" number="07" title="Data Retention">
            <p>
              We retain data only as long as necessary:
            </p>
            <ul className="list-none space-y-3 mt-4">
              {[
                { label: 'Rate limit counters', detail: 'Ephemeral — purged every 60 seconds' },
                { label: 'Cache entries', detail: 'Purged every 2–15 minutes based on endpoint TTL' },
                { label: 'Server logs', detail: 'Managed by Vercel per their retention policies' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary text-white flex items-center justify-center text-[10px] font-bold border-2 border-primary shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <strong className="text-primary">{item.label}</strong>
                    <span className="text-stone-600"> — {item.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="security" number="08" title="Security">
            <p>
              We take reasonable measures to protect the Service and the minimal data we process:
            </p>
            <ul className="list-none space-y-3 mt-4">
              {[
                'HTTPS encryption for all API communications',
                'Rate limiting to prevent abuse and DDoS attacks',
                'Input validation on all API parameters',
                'No storage of sensitive user data',
                'Regular security updates to dependencies',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-tertiary text-white flex items-center justify-center text-xs font-bold border-2 border-primary shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              However, no method of transmission over the Internet is 100% secure. While we strive to protect
              the Service, we cannot guarantee absolute security.
            </p>
          </Section>

          <Section id="children" number="09" title="Children&apos;s Privacy">
            <p>
              ShineiAPI does not knowingly collect personal information from anyone under the age of 13.
              The Service is a public API that does not require registration. If you are a parent or guardian
              and believe your child has provided personal information, please contact us so we can take
              appropriate action.
            </p>
          </Section>

          <Section id="changes" number="10" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with
              an updated &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
              Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section id="contact" number="11" title="Contact Us">
            <p>
              If you have questions or concerns about this Privacy Policy, please:
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/Shineii86/ShineiAPI/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-bold uppercase text-xs tracking-widest bg-primary text-white px-6 py-3 border-4 border-primary hover:bg-accent hover:text-primary active:translate-y-1 active:translate-x-1 transition-all shadow-brutal text-center"
              >
                Open a GitHub Issue
              </a>
              <a
                href="https://github.com/Shineii86/ShineiAPI"
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-bold uppercase text-xs tracking-widest bg-surface text-primary px-6 py-3 border-4 border-primary hover:bg-accent active:translate-y-1 active:translate-x-1 transition-all shadow-brutal text-center"
              >
                View on GitHub
              </a>
            </div>
          </Section>

          {/* Footer nav handled by LegalLayout */}
    </LegalLayout>
  );
}
