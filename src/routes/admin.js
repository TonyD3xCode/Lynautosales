import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../services/db.js';

export const router = express.Router();

/* ============================
   LOGIN (público)
============================ */
// GET /admin/login  -> muestra formulario
router.get('/login', (req, res) => {
  if (req.session?.user) return res.redirect('/admin'); // si ya está logueado
  return res.render('admin/login', { title: 'Ingresar', error: null });
});

// POST /admin/login -> procesa credenciales
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  try {
    if (!email || !password) {
      return res.render('admin/login', { title: 'Ingresar', error: 'Completa todos los campos.' });
    }

    const [rows] = await db().query('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.render('admin/login', { title: 'Ingresar', error: 'Usuario no encontrado.' });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.render('admin/login', { title: 'Ingresar', error: 'Contraseña incorrecta.' });
    }

    // setea sesión y guarda
    req.session.user = { id: user.id, email: user.email, role: user.role || 'seller' };
    return req.session.save(() => res.redirect('/admin'));
  } catch (err) {
    console.error('Error login:', err);
    return res.status(500).render('admin/login', { title: 'Ingresar', error: 'Error interno. Intenta de nuevo.' });
  }
});

// GET /admin/logout -> cierra sesión
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    // limpia cookie si existe
    res.clearCookie('lyn.sid');
    return res.redirect('/admin/login');
  });
});

/* ============================
   RUTAS PROTEGIDAS (revisan sesión aquí mismo)
   Nota: si ya montaste ensureAuth a nivel de server, esto es redundante pero inofensivo.
============================ */
function mustBeAuth(req, res, next) {
  if (req.session?.user) return next();
  return res.redirect('/admin/login');
}

// GET /admin  -> dashboard
router.get('/', mustBeAuth, async (req, res) => {
  try {
    const [[v]] = await db().query('SELECT COUNT(*) AS total FROM vehicles');
    const [[i]] = await db().query('SELECT COUNT(*) AS total FROM inquiries');
    const [[u]] = await db().query('SELECT COUNT(*) AS total FROM users');

    return res.render('admin/dashboard', {
      title: 'Panel',
      stats: {
        vehicles: v?.total ?? 0,
        inquiries: i?.total ?? 0,
        users: u?.total ?? 0
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return res.status(500).render('admin/dashboard', {
      title: 'Panel',
      stats: { vehicles: 0, inquiries: 0, users: 0 },
      error: 'No se pudieron cargar las estadísticas.'
    });
  }
});

/* ============================
   EJEMPLO de sección protegida
============================ */
// GET /admin/vehicles
router.get('/vehicles', mustBeAuth, async (req, res) => {
  try {
    const [rows] = await db().query('SELECT id, make, model, year, price, status FROM vehicles ORDER BY id DESC LIMIT 100');
    return res.render('admin/vehicles/index', { title: 'Vehículos', items: rows });
  } catch (err) {
    console.error('Vehicles list error:', err);
    return res.status(500).render('admin/vehicles/index', { title: 'Vehículos', items: [], error: 'Error cargando vehículos.' });
  }
});
