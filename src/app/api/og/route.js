/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Dynamic OG Image Generation                         ║
 * ║  Uses @vercel/og for edge-side image rendering       ║
 * ╚══════════════════════════════════════════════════════╝
 */

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

/* ─── Color Tokens ─── */
const BG = '#f5f0e8';
const PRIMARY = '#1a1a1a';
const ACCENT = '#ffcc00';
const SECONDARY = '#e63b2e';

/* ─── Fetch font (Inter Bold TTF) ─── */
const fontPromise = fetch(
  new URL('https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Bold.woff')
).then(r => r.arrayBuffer()).catch(() => null);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'ShineiAPI';
  const rating = searchParams.get('rating');
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const chapters = searchParams.get('chapters');
  const genres = searchParams.get('genres');
  const variant = searchParams.get('variant') || 'series'; // 'series' | 'default'

  const font = await fontPromise;
  const fontConfig = font ? [{ name: 'Inter', data: font, style: 'normal', weight: 700 }] : [];

  if (variant === 'default') {
    return new ImageResponse(
      (
        <div style={{
          width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: BG,
          fontFamily: 'Inter', position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative accent bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: ACCENT }} />
          {/* Corner dots */}
          <div style={{ position: 'absolute', top: '24px', left: '24px', width: '12px', height: '12px', borderRadius: '50%', background: SECONDARY }} />
          <div style={{ position: 'absolute', top: '24px', right: '24px', width: '12px', height: '12px', borderRadius: '50%', background: PRIMARY }} />
          <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '12px', height: '12px', borderRadius: '50%', background: PRIMARY }} />
          <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '12px', height: '12px', borderRadius: '50%', background: SECONDARY }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '56px', height: '56px', background: PRIMARY, color: ACCENT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 800, borderRadius: '12px',
            }}>水</div>
            <span style={{ fontSize: '32px', fontWeight: 800, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              ShineiAPI
            </span>
          </div>

          <div style={{ fontSize: '56px', fontWeight: 800, color: PRIMARY, textTransform: 'uppercase', letterSpacing: '-0.03em', textAlign: 'center', lineHeight: 1.1 }}>
            Free Manga &amp; Manhwa
          </div>
          <div style={{ fontSize: '56px', fontWeight: 800, color: SECONDARY, textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
            REST API
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            {['No Auth', 'CORS', '60 req/min', '10 Endpoints'].map(tag => (
              <div key={tag} style={{
                padding: '8px 20px', background: PRIMARY, color: 'white',
                fontSize: '16px', fontWeight: 700, borderRadius: '8px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>{tag}</div>
            ))}
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts: fontConfig }
    );
  }

  /* ─── Series OG Image ─── */
  const genreList = genres ? genres.split(',').slice(0, 4) : [];

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px', display: 'flex',
        background: BG, fontFamily: 'Inter', position: 'relative', overflow: 'hidden',
      }}>
        {/* Accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: ACCENT }} />

        {/* Left content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 56px' }}>
          {/* Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              padding: '6px 16px', background: SECONDARY, color: 'white',
              fontSize: '13px', fontWeight: 700, borderRadius: '6px',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>ShineiAPI</div>
            {type && (
              <div style={{
                padding: '6px 16px', background: PRIMARY + '10', color: PRIMARY,
                fontSize: '13px', fontWeight: 700, borderRadius: '6px', border: `2px solid ${PRIMARY}20`,
              }}>{type}</div>
            )}
            {status && (
              <div style={{
                padding: '6px 16px', background: status === 'Completed' ? '#22c55e20' : '#0055ff15',
                color: status === 'Completed' ? '#15803d' : '#0055ff',
                fontSize: '13px', fontWeight: 700, borderRadius: '6px',
              }}>{status}</div>
            )}
          </div>

          {/* Title */}
          <div style={{
            fontSize: '44px', fontWeight: 800, color: PRIMARY,
            textTransform: 'uppercase', letterSpacing: '-0.03em',
            lineHeight: 1.1, marginBottom: '20px',
            // Truncate long titles
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {title}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
            {rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>⭐</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: PRIMARY }}>{rating}</span>
              </div>
            )}
            {chapters && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📖</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: PRIMARY }}>{chapters} Ch</span>
              </div>
            )}
          </div>

          {/* Genres */}
          {genreList.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {genreList.map(g => (
                <div key={g} style={{
                  padding: '6px 16px', background: ACCENT + '30', color: PRIMARY,
                  fontSize: '14px', fontWeight: 700, borderRadius: '8px', border: `2px solid ${PRIMARY}10`,
                }}>{g.trim()}</div>
              ))}
            </div>
          )}
        </div>

        {/* Right accent block */}
        <div style={{
          width: '280px', background: PRIMARY, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
        }}>
          <div style={{
            width: '80px', height: '80px', background: ACCENT, color: PRIMARY,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px', fontWeight: 800, borderRadius: '16px',
          }}>水</div>
          <span style={{ color: ACCENT, fontSize: '18px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            shineiapi.vercel.app
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: fontConfig }
  );
}
