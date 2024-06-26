/* eslint-env node */

// https://github.com/vercel/next.js/blob/master/packages/next/next-server/server/config.ts
const nextConfig = {
  webpack: config => {
    const oneOfRule = config.module.rules.find(rule => rule.oneOf);

    // Next 12 has multiple TS loaders, and we need to update all of them.
    const tsRules = oneOfRule.oneOf.filter(rule => rule.test && rule.test.toString().includes('tsx|ts'));

    tsRules.forEach(rule => {
      // eslint-disable-next-line no-param-reassign
      rule.include = undefined;
    });

    return config;
  },
  compress: true,
  generateEtags: true,
  pageExtensions: ['tsx', 'mdx', 'ts'],
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'e0.pxfuel.com',
      'lh3.googleusercontent.com',
      'assets-global.website-files.com',
      'yuuniq.com',
      'www.raportodiskriminimin.org',
      'ihmk-rks.net',
      "admin.m-technologie.com",
      "www.developmentaid.org"
    ],
  },
};

module.exports = nextConfig;
