import { useTranslation } from 'next-i18next'

export default function FeatureCards() {
  const { t } = useTranslation('common')

  const blocks = [
    { icon: '⏱️', title: t('features.time.title'), text: t('features.time.text') },
    { icon: '✅', title: t('features.checked.title'), text: t('features.checked.text') },
    { icon: '💳', title: t('features.financing.title'), text: t('features.financing.text') }
  ]

  return (
    <section className="container py-10 grid md:grid-cols-3 gap-6">
      {blocks.map((b, i) => (
        <div key={i} className="card p-6">
          <div className="text-2xl">{b.icon}</div>
          <h3 className="mt-3 font-semibold text-lg">{b.title}</h3>
          <p className="text-white/70 text-sm mt-1">{b.text}</p>
        </div>
      ))}
    </section>
  )
}
