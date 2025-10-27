// src/routes/admin.settings.js
import express from 'express';
import { can, CAP } from '../middleware/authz.js';
import { db } from '../services/db.js';

const router = express.Router();

router.get('/settings', can(CAP.SETTINGS), async (req, res) => {
  const [rows] = await db().query('SELECT `key`,`value` FROM site_settings');
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  const body = await req.renderAsync('admin/settings', { s: map });
  res.render('layout', { title: 'Ajustes', content: body });
});

router.post('/settings', can(CAP.SETTINGS), async (req, res) => {
  const keys = [
    'site.name','brand.primary','brand.dark',
    'contact.whatsapp','contact.email',
    'location.city','hours.week','hours.sat',
    'hero.headline','hero.sub'
  ];
  for (const k of keys) {
    const v = req.body[k] ?? '';
    await db().query('INSERT INTO site_settings (`key`,`value`) VALUES (?,?) ON DUPLICATE KEY UPDATE value=VALUES(value)', [k, v]);
  }
  res.redirect('/admin/settings?ok=1');
});

export default router;
