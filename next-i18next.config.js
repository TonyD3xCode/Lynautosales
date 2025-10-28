const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
  },
  localePath: path.resolve('./src/locales'),
  defaultNS: 'common',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
