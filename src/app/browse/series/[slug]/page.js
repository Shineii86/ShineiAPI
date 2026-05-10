/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Series Detail Page — Deep-linkable series view      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import SeriesContent from './SeriesContent';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const baseUrl = 'https://shineiapi.vercel.app';

  try {
    const res = await fetch(`${baseUrl}/api/v1/series/${slug}`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (json.success) {
      const s = json.data;
      const genreNames = s.genres?.map(g => g.name || g).join(',') || '';
      const ogUrl = `${baseUrl}/api/og?variant=series&title=${encodeURIComponent(s.title)}&rating=${s.rating || ''}&status=${s.status || ''}&type=${s.type || ''}&chapters=${s.chapters_count || ''}&genres=${encodeURIComponent(genreNames)}`;

      return {
        title: s.title,
        description: s.synopsis?.slice(0, 160) || `Read ${s.title} — ${s.chapters_count || 0} chapters, rated ${s.rating || 'N/A'}. Powered by ShineiAPI.`,
        openGraph: {
          title: `${s.title} | ShineiAPI`,
          description: s.synopsis?.slice(0, 160),
          images: [
            { url: ogUrl, width: 1200, height: 630, alt: s.title },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${s.title} | ShineiAPI`,
          description: s.synopsis?.slice(0, 160),
          images: [ogUrl],
        },
      };
    }
  } catch {}
  return { title: `Series — ${slug}` };
}

export default async function SeriesPage({ params }) {
  const { slug } = await params;
  return <SeriesContent slug={slug} />;
}
