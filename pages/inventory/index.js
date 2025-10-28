import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import VehicleCard from '../../components/VehicleCard';

export default function Inventory({ items=[] }){
  return (
    <Layout>
      <section className="container py-10">
        <h1 className="text-3xl font-extrabold mb-4">Inventario</h1>
        {items.length === 0 ? (
          <p className="text-gray-400">Sin vehículos.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {items.map(v => <VehicleCard key={v.id} v={v} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ locale, query }){
  const items = [];
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'es', ['common'])),
      items
    }
  };
}
