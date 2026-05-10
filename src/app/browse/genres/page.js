/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Genres Browse — All genres with series counts       ║
 * ╚══════════════════════════════════════════════════════╝
 */

import GenresContent from './GenresContent';

export const metadata = {
  title: 'Browse by Genre',
  description: 'Explore manga, manhwa, and webtoons by genre. Filter by action, fantasy, romance, comedy, and more — powered by ShineiAPI.',
};

export default function GenresPage() {
  return <GenresContent />;
}
