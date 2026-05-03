/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://shineiapi.vercel.app',
  generateRobotsTxt: false, // We have a custom robots.txt
  outDir: './public',
  additionalPaths: async (config) => [
    { loc: '/docs', changefreq: 'weekly', priority: 0.9 },
    { loc: '/', changefreq: 'monthly', priority: 1.0 },
  ],
};
