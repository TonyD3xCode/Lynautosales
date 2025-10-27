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
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

i18n.configure({
  locales: ['es','en'],
  defaultLocale: 'es',
  directory: path.join(__dirname, 'src', 'locales'),
  queryParameter: 'lang',
  cookie: 'lang',
  objectNotation: true
});
app.use(i18n.init);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.urlencoded({extended: true, limit: '20mb'}));
app.use(express.json({limit: '20mb'}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 6 } // 6h
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => res.setHeader('Cache-Control','public, max-age=31536000, immutable')
}));
app.use('/assets', express.static(path.join(__dirname, 'src', 'assets')));

// Ensure DB connectivity early (log only)
try {
  const conn = await db().getConnection();
  conn.release();
} catch (e) {
  console.error('DB connection failed:', e.message);
}

app.use('/', publicRouter);
app.use('/admin', adminRouter);

app.use((req,res)=>{
  res.status(404).render('layout', { 
    title: '404', 
    content: `<h2>${req.__('common.not_found')}</h2>`,
    user: req.session.user || null
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`LYN AutoSales ON :${PORT}`));
