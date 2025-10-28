// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export default function Header() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const toggleLang = () => {
    const next = locale === 'es' ? 'en' : 'es';
    router.push({ pathname, query }, asPath, { locale: next });
  };

  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand">LYN AutoSales</Link>

        <nav className="menu">
          <Link href="/inventory">{t('menu.inventory')}</Link>
          <Link href="/about">{t('menu.about')}</Link>
          <Link href="/contact">{t('menu.contact')}</Link>
        </nav>

        <div className="actions">
          <button className="lang-btn" onClick={toggleLang} aria-label={t('lang.toggleLabel')}>
            {locale === 'es' ? t('lang.es') : t('lang.en')}
          </button>
          <Link href="/auth/login" className="login-btn" aria-label={t('menu.login')}>
            <span className="icon-user" />
          </Link>
        </div>
      </div>
    </header>
  );
}
