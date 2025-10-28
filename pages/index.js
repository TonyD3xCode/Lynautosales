import Header from '@/components/Header'
import Hero from '@/components/Hero'
import FeatureCards from '@/components/FeatureCards'
import InventoryTeaser from '@/components/InventoryTeaser'
import Footer from '@/components/Footer'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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
  )
}

export async function getStaticProps({ locale = 'es' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    },
    revalidate: 60
  }
}
