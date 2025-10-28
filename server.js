import express from 'express';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import i18n from 'i18n';
import { fileURLToPath } from 'url';

import { router as publicRouter } from './src/routes/public.js';
import { router as adminRouter } from './src/routes/admin.js';

import { ensureAuth, buildAdminMenu, allowAnonAdminPaths } from './src/middleware/authz.js';
import { db, initSchema } from './src/services/db.js';

dotenv.config();

// __dirname ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// MUY IMPORTANTE en Railway/Proxies:
app.set('trust proxy', 1);

// Seguridad básica
app.use(helmet({ contentSecurityPolicy: false }));

// Body parsers
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));

// Sesión (cookie válida detrás de proxy)
app.use(session({
  name: 'lyn.sid',
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' // con trust proxy = OK en Railway
  }
}));
// estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));
// Rutas públicas del sitio
app.use('/', publicRouter);
app.use('/admin', adminRouter);


// DB warm-up + schema
try {
  const c = await db().getConnection(); c.release();
  await initSchema();
} catch (e) {
  console.error('DB init error:', e);
}

// Admin: primero dejar pasar login/logout sin auth, luego proteger el resto
app.use('/admin', allowAnonAdminPaths, adminRouter);   // /admin/login y /admin/logout sin bloqueo
app.use('/admin', ensureAuth, (req, res, next) => {    // del resto hacia abajo, con auth
  res.locals.adminMenu = buildAdminMenu(req.session.user?.role || 'seller');
  next();
});

// 404
app.use((req, res) => {
  res.status(404).render('pages/404.ejs', { title: '404' });
});

// i18n config
i18n.configure({
  locales: ['es','en'],
  defaultLocale: 'es',
  directory: path.join(__dirname, 'src', 'locales'),
  queryParameter: 'lang',
  cookie: 'lang',
  objectNotation: true
});
app.use(i18n.init);

// Helpers disponibles en EJS
app.use((req, res, next) => {
  // i18n en vistas: __ y getLocale
  res.locals.__ = req.__.bind(req);
  res.locals.locale = req.getLocale();
  // usuario y request si los necesitas en partials
  res.locals.user = req.session?.user || null;
  res.locals.req = req;
  next();
});


// Start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`LYN AutoSales ON :${PORT}`));
