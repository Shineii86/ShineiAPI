/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://shineiapi.vercel.app',
  generateRobotsTxt: false, // We have a custom robots.txt
  outDir: './public',
  additionalPaths: async (config) => [
    { loc: '/docs', changefreq: 'weekly', priority: 0.9 },
    { loc: '/browse', changefreq: 'daily', priority: 0.8 },
    { loc: '/', changefreq: 'monthly', priority: 1.0 },
  ],
};
