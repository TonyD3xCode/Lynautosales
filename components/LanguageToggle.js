import { useRouter } from 'next/router'

export default function LanguageToggle() {
  const router = useRouter()
  const { pathname, query, asPath, locale } = router

  const toggle = () => {
    const next = locale === 'es' ? 'en' : 'es'
    router.push({ pathname, query }, asPath, { locale: next })
  }

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-md border border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black transition grid place-items-center"
    >
      {locale?.toUpperCase()}
    </button>
  )
}
