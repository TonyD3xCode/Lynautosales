import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export default function Hero(){
  const { t } = useTranslation('common');
  return (
    <section className="py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero.svg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/65" />
      <div className="container relative">
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-accent">{t('home.title')}</h1>
        <p className="mt-2 max-w-2xl text-gray-300">{t('home.subtitle')}</p>
        <div className="mt-5 flex gap-3 flex-wrap">
          <Link className="btn" href="/inventory">{t('home.viewInventory')}</Link>
          <a className="btn-outline" href="https://wa.me/18506333816" target="_blank" rel="noreferrer">{t('home.whatsapp')}</a>
        </div>
        <form action="/inventory" className="mt-5 flex gap-2">
          <input name="q" placeholder={t('home.searchPlaceholder')} className="input" />
          <button className="btn-outline h-11">{t('home.search')}</button>
        </form>
      </div>
    </section>
  );
}
