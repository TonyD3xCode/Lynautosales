import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';

export default function Header({ user }){
  const router = useRouter();
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  const switchLang = () => {
    const next = router.locale === 'es' ? 'en' : 'es';
    router.push(router.asPath, router.asPath, { locale: next });
  };

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    const onEsc = (e)=>{ if(e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open]);

  return (
    <header className="header-blur sticky top-0 z-50 border-b border-brand-line">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" aria-label={t('brand')} className="flex items-center gap-2">
          <img src="/logo.svg" alt="LYN" className="h-7" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/inventory">{t('menu.inventory')}</Link>
          <Link href="/about">{t('menu.about')}</Link>
          <Link href="/contact">{t('menu.contact')}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={switchLang} className="w-10 h-10 rounded-xl border border-brand-line bg-brand-muted">
            {router.locale?.toUpperCase()}
          </button>
          <Link href={user ? '/admin' : '/auth/login'} className="w-10 h-10 rounded-xl border border-brand-accent bg-brand-accent text-black grid place-items-center font-bold" aria-label={t('menu.login')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-9 3-9 6v2h18v-2c0-3-4-6-9-6Z"/></svg>
          </Link>
          <button onClick={()=>setOpen(true)} className="md:hidden w-10 h-10 rounded-xl border border-brand-line bg-brand-muted grid place-items-center" aria-label="Menú" aria-expanded={open}>
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div onClick={()=>setOpen(false)} className={`fixed inset-0 bg-black/60 ${open ? 'block' : 'hidden'}`}></div>
      {/* Drawer */}
      <aside className={`fixed right-0 top-0 h-screen w-[78vw] max-w-[340px] bg-brand-muted border-l border-brand-line p-4 ${open ? 'block' : 'hidden'}`}>
        <div className="flex justify-end">
          <button onClick={()=>setOpen(false)} className="w-10 h-10 rounded-xl border border-brand-line grid place-items-center" aria-label="Cerrar">✕</button>
        </div>
        <nav className="mt-4 flex flex-col gap-3 text-lg">
          <Link onClick={()=>setOpen(false)} href="/inventory">{t('menu.inventory')}</Link>
          <Link onClick={()=>setOpen(false)} href="/about">{t('menu.about')}</Link>
          <Link onClick={()=>setOpen(false)} href="/contact">{t('menu.contact')}</Link>
          <button onClick={()=>{switchLang(); setOpen(false);}} className="btn-outline mt-2 w-full">{(router.locale==='es'?'EN':'ES')}</button>
          <Link onClick={()=>setOpen(false)} className="btn mt-2 w-full" href={user ? '/admin' : '/auth/login'}>{t('menu.login')}</Link>
        </nav>
      </aside>
    </header>
  );
}
