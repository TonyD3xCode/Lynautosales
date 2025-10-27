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

export function ensureAuth(req, res, next) {
  if (!req.session?.user) return res.redirect('/admin/login');
  res.locals.currentUser = req.session.user;
  next();
}

export function can(cap) {
  return (req, res, next) => {
    const role = req.session?.user?.role || 'seller';
    const allowed = (ROLE_CAPS[role] || []).includes(cap);
    if (!allowed) return res.status(403).render('error', { message: 'No autorizado' });
    next();
  };
}

export function buildAdminMenu(role='seller') {
  const caps = ROLE_CAPS[role] || [];
  const I = (c) => caps.includes(c);
  const items = [];
  items.push({ href:'/admin', label:'Escritorio', icon:'🏠' }); // dashboard
  if (I(CAP.INV_READ))  items.push({ href:'/admin/vehicles', label:'Inventario', icon:'🚗' });
  if (I(CAP.INQ_READ))  items.push({ href:'/admin/inquiries', label:'Consultas', icon:'💬' });
  if (I(CAP.REV_READ))  items.push({ href:'/admin/reviews',  label:'Reseñas',   icon:'⭐' });
  if (I(CAP.MEDIA))     items.push({ href:'/admin/media',    label:'Medios',    icon:'🖼️' });
  if (I(CAP.USERS))     items.push({ href:'/admin/users',    label:'Usuarios',  icon:'👥' });
  if (I(CAP.SETTINGS))  items.push({ href:'/admin/settings', label:'Ajustes',   icon:'⚙️' });
  return items;
}
