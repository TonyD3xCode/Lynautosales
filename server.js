import express from 'express';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
import i18n from 'i18n';
import { fileURLToPath } from 'url';

dotenv.config(); // 👉 Cargar variables antes de usarlas

// Rutas y servicios
import { router as publicRouter } from './src/routes/public.js';
import { router as adminRouter } from './src/routes/admin.js';
import { db, initSchema } from './src/services/db.js';
import { ensureAuth, buildAdminMenu } from './src/middleware/authz.js';

// Paths ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asegurar DB y esquema (usa .env ya cargado)
await db().getConnection().then(c => c.release());
await initSchema();

// App
const app = express();

// Seguridad base
app.use(helmet({ contentSecurityPolicy: false }));

// Body parsers
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json({ limit: '20mb' }));

// Sesiones (antes de cualquier middleware que use req.session)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 6 } // 6h
}));

// i18n
i18n.configure({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  directory: path.join(__dirname, 'src', 'locales'),
  queryParameter: 'lang',
  cookie: 'lang',
  objectNotation: true
});
app.use(i18n.init);

// Helpers para vistas
app.use((req, res, next) => {
  res.locals.req = req;
  res.locals.user = req.session?.user || null;
  // fallback sencillo por si alguna vista usa __ o t sin i18n
  res.locals.__ = res.__ || ((k) => k);
  res.locals.t  = res.__ || ((k) => k);
  next();
});

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
}));
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));

// Log de conectividad DB (opcional)
try {
  const conn = await db().getConnection();
  conn.release();
} catch (e) {
  console.error('DB connection failed:', e.message);
}

// Preparar menú y proteger /admin (antes de montar el router de admin)
app.use('/admin', ensureAuth, (req, res, next) => {
  res.locals.adminMenu = buildAdminMenu(req.session.user?.role || 'seller');
  next();
});

// Rutas
app.use('/', publicRouter);
app.use('/admin', adminRouter);

app.use((req,res)=>{
  res.status(404).render('layout', { 
    title: '404', 
    content: `<h2>${req.__('common.not_found')}</h2>`,
    user: req.session.user || null
  });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LYN AutoSales ON :${PORT}`));
