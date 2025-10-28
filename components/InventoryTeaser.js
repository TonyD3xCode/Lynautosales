import { useTranslation } from 'next-i18next'

export default function InventoryTeaser() {
  const { t } = useTranslation('common')
  const mock = [
    { id: 1, title: '2020 Toyota Camry SE', price: '$18,900', img: '/placeholder/car-1.jpg' },
    { id: 2, title: '2019 Honda Civic EX', price: '$16,400', img: '/placeholder/car-2.jpg' },
    { id: 3, title: '2021 Chevy Tahoe LT', price: '$48,700', img: '/placeholder/car-3.jpg' }
  ]

  return (
    <section className="container py-12">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold">{t('teaser.title')}</h2>
        <a href="/inventory" className="btn btn-ghost">{t('teaser.viewAll')}</a>
      </div>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {mock.map(car => (
          <div key={car.id} className="card overflow-hidden">
            <img src={car.img} alt={car.title} className="h-44 w-full object-cover" />
            <div className="p-5">
              <h3 className="font-semibold">{car.title}</h3>
              <p className="mt-1 text-brand-yellow font-bold">{car.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
