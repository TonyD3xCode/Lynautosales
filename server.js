import express from 'express';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import i18n from 'i18n';
import { fileURLToPath } from 'url';

import { router as publicRouter } from './src/routes/public.js';
import { router as adminRouter } from './src/routes/admin.js';

import { db, initSchema } from './src/services/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

// Seguridad básica
app.use(helmet({ contentSecurityPolicy: false }));

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets'), {
  setHeaders: (res) => res.setHeader('Cache-Control','public, max-age=31536000, immutable')
}));

// Body parsers
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));

// Sesiones (antes de cualquier middleware que las use)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 6 } // 6 horas
}));

// i18n
i18n.configure({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  directory: path.join(__dirname, 'src', 'locales'),
  queryParameter: 'lang',
  cookie: 'lang',
  objectNotation: true,
  updateFiles: false
});
app.use(i18n.init);

// Locals seguros para TODAS las vistas
app.use((req, res, next) => {
  // Enlaza __ a la request para que funcione correctamente
  res.locals.__     = req.__.bind(req);
  res.locals.t      = res.locals.__;           // alias
  res.locals.locale = (req.getLocale && req.getLocale()) || 'es';
  res.locals.user   = req.session?.user || null;
  next();
});

// Verifica DB al inicio (log-only)
try {
  const conn = await db().getConnection();
  conn.release();
} catch (e) {
  console.error('DB connection failed:', e?.message || e);
}

// Rutas
app.use('/', publicRouter);
app.use('/admin', adminRouter);

// 404
app.use((req, res) => {
  res.status(404).render('layout', {
    title: res.locals.__('common.not_found'),
    body: `<section class="container"><h2>${res.locals.__('common.not_found')}</h2></section>`
  });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LYN AutoSales Funciona correctamente :${PORT}`));
