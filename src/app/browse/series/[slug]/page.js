/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Series Detail Page — Deep-linkable series view      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import SeriesContent from './SeriesContent';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(`https://shineiapi.vercel.app/api/v1/series/${slug}`, {
      next: { revalidate: 300 },
    });
    const json = await res.json();
    if (json.success) {
      const s = json.data;
      return {
        title: s.title,
        description: s.synopsis?.slice(0, 160) || `Read ${s.title} — ${s.chapters_count || 0} chapters, rated ${s.rating || 'N/A'}. Powered by ShineiAPI.`,
        openGraph: {
          title: `${s.title} | ShineiAPI`,
          description: s.synopsis?.slice(0, 160),
          images: s.cover?.large ? [{ url: s.cover.large, width: 600, height: 900 }] : [],
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
