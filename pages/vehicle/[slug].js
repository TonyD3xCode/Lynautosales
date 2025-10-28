import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../components/Layout';
import Image from 'next/image';

export default function VehicleDetail({ v }){
  return (
    <Layout>
      <section className="container py-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative w-full h-72 md:h-[480px] border border-brand-line rounded-xl overflow-hidden">
            <Image src={v.main_photo || '/placeholder.svg'} alt="Vehicle" fill style={{objectFit:'cover'}} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">{v.year} {v.make} {v.model}</h1>
            <p className="mt-2 text-gray-300">${v.price?.toLocaleString?.() || v.price || '—'}</p>
            <p className="mt-2 text-gray-400">VIN: {v.vin || '—'}</p>
            <p className="mt-2 text-gray-400">Mileage: {v.mileage ? `${Number(v.mileage).toLocaleString()} mi` : '—'}</p>
            <a className="btn mt-4" href="https://wa.me/18506333816" target="_blank" rel="noreferrer">Solicitar información</a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ params, locale }){
  const v = { id: 1, year: 2018, make: 'Nissan', model: 'Rogue', price: 11990, mileage: 98000 };
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'es', ['common'])),
      v
    }
  };
}
