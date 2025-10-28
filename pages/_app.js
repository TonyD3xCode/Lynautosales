import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>LYN AutoSales</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(App);
