/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Terms of Service — Neo-Brutalist                    ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import Link from 'next/link';
import LegalLayout from '@/components/LegalLayout';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for ShineiAPI — the free manga, manhwa, and webtoon REST API.',
};

const lastUpdated = 'May 3, 2026';

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="mb-12">
      <div className="flex items-center gap-4 mb-5">
        <span className="w-10 h-10 bg-primary text-white flex items-center justify-center font-display font-bold text-sm border-2 border-primary shrink-0">
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

export default function TermsPage() {
  return (
    <LegalLayout>
          {/* Title */}
          <div className="mb-16">
            <div className="inline-block bg-accent text-primary px-4 py-1.5 border-2 border-primary font-display font-bold text-xs uppercase tracking-widest mb-6 shadow-brutal">
              Legal
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter text-primary mb-6">
              Terms of<br />
              <span className="bg-primary text-white px-4 py-2 border-4 border-primary inline-block transform -rotate-1">
                Service
              </span>
            </h1>
            <p className="text-lg text-stone-600 border-l-4 border-secondary pl-6 py-2">
              These terms govern your use of ShineiAPI. By using the API, you agree to these terms.
              Last updated: <strong className="text-primary">{lastUpdated}</strong>
            </p>
          </div>

          {/* Sections */}
          <Section id="acceptance" number="01" title="Acceptance of Terms">
            <p>
              By accessing or using ShineiAPI (the &quot;Service&quot;), you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree to these Terms, do not use the Service. We reserve the right to
              modify these Terms at any time. Continued use of the Service after changes constitutes acceptance
              of the modified Terms.
            </p>
          </Section>

          <Section id="description" number="02" title="Service Description">
            <p>
              ShineiAPI is a free, public REST API that provides manga, manhwa, and webtoon data. It acts as a
              middleware layer on top of the <a href="https://toraka.com" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">Toraka</a> API,
              adding caching, rate limiting, data normalization, and error handling.
            </p>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.
              We do not guarantee uptime, accuracy, or completeness of data.
            </p>
          </Section>

          <Section id="usage" number="03" title="Acceptable Use">
            <p>You agree to use the Service only for lawful purposes. You must NOT:</p>
            <ul className="list-none space-y-3 mt-4">
              {[
                'Exceed the rate limit of 60 requests per minute per IP address',
                'Attempt to bypass, disable, or circumvent rate limiting mechanisms',
                'Use the Service to build a competing API or redistribute data as a standalone product',
                'Scrape, crawl, or use automated tools to extract data beyond normal API usage',
                'Use the Service for any illegal, harmful, or abusive purpose',
                'Resell, sublicense, or charge access to the Service without explicit permission',
                'Misrepresent the origin of data provided by the Service',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-secondary text-white flex items-center justify-center text-xs font-bold border-2 border-primary shrink-0 mt-0.5">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="rate-limits" number="04" title="Rate Limiting">
            <p>
              The Service enforces a rate limit of <strong className="text-primary">60 requests per minute</strong> per
              IP address. Rate limit information is included in response headers (<code className="bg-surface-dim px-2 py-0.5 border border-primary text-xs font-mono">X-RateLimit-Limit</code>,{' '}
              <code className="bg-surface-dim px-2 py-0.5 border border-primary text-xs font-mono">X-RateLimit-Remaining</code>).
            </p>
            <p>
              Exceeding the rate limit will result in a <code className="bg-surface-dim px-2 py-0.5 border border-primary text-xs font-mono">429 Too Many Requests</code> response.
              Persistent abuse may result in temporary or permanent IP blocking.
            </p>
          </Section>

          <Section id="intellectual" number="05" title="Intellectual Property">
            <p>
              The Service&apos;s source code is licensed under the{' '}
              <a href="https://github.com/Shineii86/ShineiAPI/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">MIT License</a>.
            </p>
            <p>
              Manga, manhwa, and webtoon data (titles, synopses, cover images, etc.) are sourced from Toraka
              and are the property of their respective owners. ShineiAPI does not claim ownership of any content
              data. All trademarks, service marks, and trade names are the property of their respective owners.
            </p>
          </Section>

          <Section id="disclaimer" number="06" title="Disclaimer of Warranties">
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
              INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              AND NONINFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE,
              OR SECURE.
            </p>
          </Section>

          <Section id="liability" number="07" title="Limitation of Liability">
            <p>
              IN NO EVENT SHALL SHINEIAPI, ITS AUTHORS, OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
              INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH
              YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR
              BUSINESS INTERRUPTION.
            </p>
          </Section>

          <Section id="third-party" number="08" title="Third-Party Services">
            <p>
              The Service relies on the Toraka API as its upstream data source. We are not responsible for
              the availability, accuracy, or policies of Toraka or any other third-party service. The Service
              is not affiliated with or endorsed by Toraka.
            </p>
          </Section>

          <Section id="termination" number="09" title="Termination">
            <p>
              We reserve the right to restrict or terminate access to the Service at any time, for any reason,
              including but not limited to violation of these Terms. We may also discontinue the Service at
              any time without notice.
            </p>
          </Section>

          <Section id="governing" number="10" title="Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, without
              regard to conflict of law principles. Any disputes arising from these Terms shall be resolved
              in the appropriate courts of jurisdiction.
            </p>
          </Section>

          <Section id="contact" number="11" title="Contact">
            <p>
              If you have questions about these Terms, please open an issue on{' '}
              <a href="https://github.com/Shineii86/ShineiAPI/issues" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold hover:underline">GitHub</a>.
            </p>
          </Section>

          {/* Footer nav handled by LegalLayout */}
    </LegalLayout>
  );
}
