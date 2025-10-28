import { useTranslation } from 'next-i18next'

export default function Hero() {
  const { t } = useTranslation('common')

  return (
    <section className="relative overflow-hidden">
      <div className="container py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-yellow max-w-3xl">
          {t('hero.title')}
        </h1>
        <p className="mt-4 text-white/80 max-w-2xl">
          {t('hero.subtitle')}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/inventory" className="btn btn-accent">{t('cta.viewInventory')}</a>
          <a href="https://wa.me/1XXXXXXXXXX" target="_blank" rel="noreferrer" className="btn btn-ghost">
            {t('cta.whatsapp')}
          </a>
        </div>
        <form className="mt-8 flex gap-3">
          <input
            className="flex-1 h-12 rounded-md bg-brand-gray border border-white/10 px-4 outline-none"
            placeholder={t('search.placeholder')}
          />
          <button className="btn btn-ghost px-6">Buscar</button>
        </form>
      </div>
    </section>
  )
}
