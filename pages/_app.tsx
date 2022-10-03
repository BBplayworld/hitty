import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { DefaultSeo } from "next-seo";
import Script from 'next/script'
import * as gtag from '../lib/gtag'

const DEFAULT_SEO = {
  title: "Hitty",
  description: "주식, 국내주식, 해외주식, kospi, kosdaq, 코스피, 코스닥, 상한가, stock",
  canonical: "https://hitty.me",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hitty.me",
    title: "Hitty",
    site_name: "Hitty",
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...DEFAULT_SEO} />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />      
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
