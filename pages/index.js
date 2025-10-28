import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import VehicleCard from '../components/VehicleCard';

export default function Home({ featured=[] }){
  return (
    <Layout>
      <Hero />
      <section className="container py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Nuevos en inventario</h2>
          <a className="btn-outline" href="/inventory">Ver todo</a>
        </div>
        {featured.length === 0 ? (
          <p className="mt-4 text-gray-400">Sin vehículos por ahora.</p>
        ) : (
          <div className="grid gap-5 mt-4 md:grid-cols-3">
            {featured.map(v => <VehicleCard key={v.id} v={v} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}

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
