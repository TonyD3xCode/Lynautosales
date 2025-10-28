import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import LanguageToggle from './LanguageToggle'
import LoginButton from './LoginButton'
import { useState } from 'react'

export default function Header() {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-brand-black/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="LYN AutoSales" className="h-6 w-auto" />
        </Link>

        {/* Navegación escritorio */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/inventory" className="hover:text-brand-yellow">{t('menu.inventory')}</Link>
          <Link href="/about" className="hover:text-brand-yellow">{t('menu.about')}</Link>
          <Link href="/contact" className="hover:text-brand-yellow">{t('menu.contact')}</Link>
        </nav>

        {/* Botones */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <LoginButton />
        </div>

        {/* Menú móvil */}
        <button
          className="md:hidden w-10 h-10 grid place-items-center border border-white/10 rounded-md"
          onClick={() => setOpen(!open)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/>
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="md:hidden border-t border-white/10 bg-brand-black"
          onClick={() => setOpen(false)}
        >
          <div className="container py-4 flex flex-col gap-4">
            <Link href="/inventory">{t('menu.inventory')}</Link>
            <Link href="/about">{t('menu.about')}</Link>
            <Link href="/contact">{t('menu.contact')}</Link>
            <div className="flex items-center gap-3 pt-2">
              <LanguageToggle />
              <LoginButton />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
