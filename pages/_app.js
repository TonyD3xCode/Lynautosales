import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b0b0b" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(MyApp);
