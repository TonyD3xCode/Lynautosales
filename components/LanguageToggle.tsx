import { useRouter } from 'next/router';
import { useCallback } from 'react';

export default function LanguageToggle() {
  const router = useRouter();
  const { pathname, query, asPath, locale } = router;

  const toggle = useCallback(() => {
    const next = locale === 'es' ? 'en' : 'es';
    router.push({ pathname, query }, asPath, { locale: next });
  }, [locale, pathname, query, asPath, router]);

  return (
    <button
      onClick={toggle}
      aria-label="Change language"
      className="w-10 h-10 rounded-md border border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-black transition grid place-items-center"
      title={locale?.toUpperCase()}
    >
      {locale?.toUpperCase()}
    </button>
  );
}
