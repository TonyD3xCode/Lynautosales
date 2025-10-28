// src/middleware/authz.js
export const CAP = {
  DASHBOARD: 'dashboard.view',
  INV_READ: 'inventory.read',
  INV_WRITE: 'inventory.write',
  INQ_READ: 'inquiries.read',
  INQ_WRITE: 'inquiries.write',
  REV_READ: 'reviews.read',
  REV_WRITE: 'reviews.write',
  MEDIA: 'media.manage',
  USERS: 'users.manage',
  SETTINGS: 'settings.manage',
};

const ROLE_CAPS = {
  admin: Object.values(CAP),
  manager: [
    CAP.DASHBOARD, CAP.INV_READ, CAP.INV_WRITE,
    CAP.INQ_READ, CAP.INQ_WRITE,
    CAP.REV_READ, CAP.REV_WRITE,
    CAP.MEDIA
  ],
  seller: [CAP.DASHBOARD, CAP.INV_READ, CAP.INQ_READ]
};

export function can(cap) {
  return (req, res, next) => {
    const role = req.session?.user?.role || 'seller';
    const allowed = (ROLE_CAPS[role] || []).includes(cap);
    if (!allowed) return res.status(403).render('error', { message: 'No autorizado' });
    next();
  };
}

// src/middleware/authz.js
export function allowAnonAdminPaths(req, res, next) {
  // Dejar pasar el login y logout
  if (req.path === '/login' || req.path === '/logout') return next();
  return next('route'); // pasa al siguiente app.use('/admin', …)
}

export function ensureAuth(req, res, next) {
  if (req.session?.user) return next();
  return res.redirect('/admin/login');
}

export function buildAdminMenu(role = 'seller') {
  const base = [
    { href:'/admin',            label:'Dashboard' },
    { href:'/admin/vehicles',   label:'Vehículos' },
    { href:'/admin/inquiries',  label:'Consultas' },
  ];
  if (role === 'manager' || role === 'admin') {
    base.push({ href:'/admin/users', label:'Usuarios' });
    base.push({ href:'/admin/settings', label:'Ajustes' });
  }
  if (role === 'admin') {
    base.push({ href:'/admin/audit', label:'Auditoría' });
  }
  return base;
}
