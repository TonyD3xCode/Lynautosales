import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../services/db.js';

export const router = express.Router();

// middleware auth básico
function requireAuth(req, res, next) {
  if (req.session?.user && ['admin','manager'].includes(req.session.user.role)) return next();
  return res.redirect('/admin/login');
}

// GET /admin -> redirige a dashboard o login
router.get('/', async (req, res, next) => {
  try {
    if (req.session?.user) return res.redirect('/admin/dashboard');
    const content = await renderAsyncLocal(req, 'admin/login', { error: null });
    res.render('layout', { title: 'Login', content });
  } catch (e) { next(e); }
});

// login explícito
router.get('/login', async (req, res, next) => {
  try {
    const content = await renderAsyncLocal(req, 'admin/login', { error: null });
    res.render('layout', { title: 'Login', content });
  } catch (e) { next(e); }
});

router.post('/login', express.urlencoded({ extended: true }), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [[user]] = await db().query('SELECT id,email,password_hash,role FROM users WHERE email=? LIMIT 1', [email]);
    if (!user) {
      const content = await renderAsyncLocal(req, 'admin/login', { error: 'Usuario o contraseña inválidos' });
      return res.status(401).render('layout', { title: 'Login', content });
    }
    const ok = await bcrypt.compare(password, user.password_hash || '');
    if (!ok) {
      const content = await renderAsyncLocal(req, 'admin/login', { error: 'Usuario o contraseña inválidos' });
      return res.status(401).render('layout', { title: 'Login', content });
    }
    req.session.user = { id: user.id, email: user.email, role: user.role };
    res.redirect('/admin/dashboard');
  } catch (e) { next(e); }
});

router.post('/logout', (req, res) => {
  req.session?.destroy?.(()=> res.redirect('/admin/login'));
});

// Panel principal
router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const [[stats]] = await db().query(`
      SELECT
        (SELECT COUNT(*) FROM vehicles) AS vehicles,
        (SELECT COUNT(*) FROM inquiries) AS inquiries,
        (SELECT COUNT(*) FROM users)    AS users
    `);
    const content = await renderAsyncLocal(req, 'admin/dashboard', { stats });
    res.render('layout', { title: 'Panel', content });
  } catch (e) { next(e); }
});
