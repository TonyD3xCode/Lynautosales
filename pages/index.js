import Header from '../src/components/Header';
import Hero from '../src/components/Hero';
import FeatureCards from '../src/components/FeatureCards';
import InventoryTeaser from '../src/components/InventoryTeaser';
import Footer from '../src/components/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeatureCards />
        <InventoryTeaser />
      </main>
      <Footer />
    </>
  );
}

export async function getStaticProps({ locale = 'es' }) {
  return {
    props: { ...(await serverSideTranslations(locale, ['common'])) },
  };
}
