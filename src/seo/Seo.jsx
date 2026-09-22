import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SITE_URL = 'https://ezone.example.com';

function Seo({
  title,
  description,
  path = '/',
  image = '/og-default.png',
  type = 'website',
  noindex = false,
}) {
  const { i18n } = useTranslation();
  const isFa = i18n.language === 'fa';
  const lang = isFa ? 'fa' : 'en';
  const dir = isFa ? 'rtl' : 'ltr';

  const fullTitle = title ? `${title} | E-ZONE` : 'E-ZONE — Digital Gateway to Free Trade Zones';
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet htmlAttributes={{ lang, dir }}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* hreflang */}
      <link rel="alternate" hrefLang="fa" href={`${SITE_URL}${path}`} />
      <link rel="alternate" hrefLang="en" href={`${SITE_URL}${path}?lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${SITE_URL}${image}`} />
      <meta property="og:locale" content={isFa ? 'fa_IR' : 'en_US'} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${image}`} />

      {/* JSON-LD Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'E-ZONE',
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          sameAs: [],
        })}
      </script>
    </Helmet>
  );
}

export default Seo;
