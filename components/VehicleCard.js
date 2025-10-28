import Image from 'next/image';
import Link from 'next/link';

export default function VehicleCard({ v }){
  const title = `${v.year||''} ${v.make||''} ${v.model||''}`.trim();
  const src = v.main_photo || '/placeholder.svg';
  return (
    <article className="card">
      <div className="relative h-48">
        <Image src={src} alt={title || 'Vehicle'} fill style={{objectFit:'cover'}} sizes="(max-width:768px) 100vw, 33vw" />
      </div>
      <div className="p-3">
        <h3 className="font-bold">{title || 'Vehicle'}</h3>
        <p className="text-sm text-gray-400">
          {v.mileage ? `${Number(v.mileage).toLocaleString()} mi` : ''} {v.price ? `· $${Number(v.price).toLocaleString()}` : ''}
        </p>
        <Link href={`/vehicle/${v.slug || v.id || '1'}`} className="btn-outline mt-3 inline-flex">Ver</Link>
      </div>
    </article>
  );
}
