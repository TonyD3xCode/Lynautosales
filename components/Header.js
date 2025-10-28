import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import LanguageToggle from './LanguageToggle';
import LoginButton from './LoginButton';
import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => { if (open && ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-brand-black/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        {/* Logo izquierda */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="LYN AutoSales" className="h-6 w-auto" />
        </Link>

        {/* Nav derecha */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8 text-sm">
            <Link href="/inventory" className="hover:text-brand-yellow">{t('menu.inventory')}</Link>
            <Link href="/about" className="hover:text-brand-yellow">{t('menu.about')}</Link>
            <Link href="/contact" className="hover:text-brand-yellow">{t('menu.contact')}</Link>
          </nav>
          <LanguageToggle />
          <LoginButton />
        </div>

        {/* Menú móvil */}
        <button
          className="md:hidden w-10 h-10 grid place-items-center border border-white/10 rounded-md"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>
        </button>
      </div>

      {/* Overlay + panel móvil */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/50">
          <div ref={ref} className="ml-auto h-full w-72 bg-brand-black border-l border-white/10 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <LoginButton />
              <button className="ml-auto" onClick={() => setOpen(false)} aria-label="Cerrar">
                ✕
              </button>
            </div>
            <nav className="mt-3 flex flex-col gap-4 text-base">
              <Link href="/inventory" onClick={() => setOpen(false)}>{t('menu.inventory')}</Link>
              <Link href="/about" onClick={() => setOpen(false)}>{t('menu.about')}</Link>
              <Link href="/contact" onClick={() => setOpen(false)}>{t('menu.contact')}</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
