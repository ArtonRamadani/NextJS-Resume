import {Analytics} from '@vercel/analytics/react';
import {Head, Html, Main, NextScript} from 'next/document';

// next/document <Head /> vs next/head <Head />
//
// next/document Head is rendered once on the server. This is different from next/head which will
// rebuild the next/head fields each time it's called, and won't overwrite next/document's Head.

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta content="translate" name="google" />

        {/* SEO Meta Tags */}
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta
          content="Hello, I am Arton Ramadani, a software engineer and freelance developer from Kosovo. Explore my portfolio showcasing my work in web development, outsourcing solutions, and more."
          name="description"
        />
        <meta content="Arton, Developer, Kosovo, Freelance, Outsource, Portfolio, Software Engineer" name="keywords" />

        <meta
          content="https://arton-ramadani.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofilepic.6178d642.jpg&w=640&q=75"
          property="og:image"
        />
        <meta content="Arton Ramadani Portfolio" property="og:title" />
        <meta
          content="Hello, I am Arton Ramadani, a software engineer specializing in web development. Check out my portfolio for my latest projects."
          property="og:description"
        />
        <meta content="https://arton-ramadani.vercel.app/" property="og:url" />
      </Head>
      <body className="bg-black">
        <Analytics />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
