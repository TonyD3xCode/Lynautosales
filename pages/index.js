import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';
import InventoryTeaser from '@/components/InventoryTeaser';
import Footer from '@/components/Footer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function HomePage() {
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

export const getStaticProps: GetStaticProps = async ({ locale = 'es' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common']))
  },
  revalidate: 60
});

export async function getServerSideProps({ locale }){
  // Conecta tu API real con process.env.API_BASE_URL (Railway).
  const featured = [];
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'es', ['common'])),
      featured
    }
  };
}
