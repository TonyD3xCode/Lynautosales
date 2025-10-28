// pages/index.js
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <>
      <Head>
        <title>LYN AutoSales</title>
      </Head>

      <Header />

      <main className="container">
        <section className="hero">
          <h1>{t('home.title')}</h1>
          <p>{t('home.subtitle')}</p>

          <div className="cta">
            <a className="btn btn-primary" href="/inventory">
              {t('buttons.viewInventory')}
            </a>
            <a className="btn btn-secondary" href="https://wa.me/1XXXXXXXXXX" target="_blank" rel="noreferrer">
              {t('buttons.whatsapp')}
            </a>
          </div>

          <form className="search">
            <input placeholder={t('home.searchPlaceholder')} />
            <button type="submit" className="btn">{t('buttons.search')}</button>
          </form>
        </section>

        <section className="features grid-3">
          <div className="feature">
            <h3>{t('home.time')}</h3>
            <p>{t('home.timeText')}</p>
          </div>
          <div className="feature">
            <h3>{t('home.checked')}</h3>
            <p>{t('home.checkedText')}</p>
          </div>
          <div className="feature">
            <h3>{t('home.financing')}</h3>
            <p>{t('home.financingText')}</p>
          </div>
        </section>

        <section className="teaser">
          <div className="teaser-head">
            <h2>{t('home.newInventory')}</h2>
            <a className="btn btn-outline" href="/inventory">{t('buttons.viewAll')}</a>
          </div>

          {/* Cards de ejemplo — remplaza por tus datos */}
          <div className="cards grid-3">
            {/* usa /public/images/... o Image con domains (ver abajo) */}
            <a className="card">
              <img src="/images/sample-1.jpg" alt="Toyota Camry" />
              <h4>2020 Toyota Camry SE</h4>
            </a>
            <a className="card">
              <img src="/images/sample-2.jpg" alt="Honda Civic" />
              <h4>2019 Honda Civic EX</h4>
            </a>
            <a className="card">
              <img src="/images/sample-3.jpg" alt="Chevy Tahoe" />
              <h4>2021 Chevy Tahoe LT</h4>
            </a>
          </div>

          <p className="muted">{t('home.noVehicles')}</p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export async function getStaticProps({ locale = 'es' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  };
}
