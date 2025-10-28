import type { AppProps } from 'next/app';
import Head from 'next/head';
import { appWithTranslation } from '../lib/i18n';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet"/>
        <title>LYN AutoSales</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
export default appWithTranslation(App);
