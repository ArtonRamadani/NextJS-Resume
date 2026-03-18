import {Analytics} from '@vercel/analytics/react';
import {Head, Html, Main, NextScript} from 'next/document';

import portfolioData from '../data/portfolioData.json';

// next/document <Head /> vs next/head <Head />
//
// next/document Head is rendered once on the server. This is different from next/head which will
// rebuild the next/head fields each time it's called, and won't overwrite next/document's Head.

export default function Document() {
  const m = portfolioData.meta;
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta content="translate" name="google" />

        {/* SEO Meta Tags */}
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content={m.description} name="description" />
        {m.keywords && <meta content={m.keywords} name="keywords" />}
        {m.author && <meta content={m.author} name="author" />}

        {/* Open Graph */}
        <meta content="website" property="og:type" />
        <meta content={m.ogTitle || m.title} property="og:title" />
        <meta content={m.ogDescription || m.description} property="og:description" />
        {m.ogUrl && <meta content={m.ogUrl} property="og:url" />}
        {m.ogImage && <meta content={m.ogImage} property="og:image" />}
        <meta content={m.title} property="og:site_name" />

        {/* Twitter Card */}
        <meta content={m.twitterCard || 'summary_large_image'} name="twitter:card" />
        <meta content={m.ogTitle || m.title} name="twitter:title" />
        <meta content={m.ogDescription || m.description} name="twitter:description" />
        {m.ogImage && <meta content={m.ogImage} name="twitter:image" />}

        {/* AI / LLM Context */}
        {m.aiDescription && <meta content={m.aiDescription} name="ai:description" />}

        {m.ogUrl && <link href={m.ogUrl} rel="canonical" />}
      </Head>
      <body className="bg-black">
        <Analytics />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
