// src/routes/public.js
import { Router } from 'express';
import { renderAsync } from '../utils/renderAsync.js';

export const router = Router();

// Helper para capturar errores async sin romper Express
const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Home
router.get(
  '/',
  asyncH(async (req, res) => {
    const html = await renderAsync(res, 'home', {
      title: res.__ ? res.__('common.home') : 'Inicio',
      page: 'home',
    });
    res.send(html);
  })
);

// Inventario (lista)
router.get(
  '/inventory',
  asyncH(async (req, res) => {
    // Si luego traes vehículos de DB, pásalos aquí:
    const html = await renderAsync(res, 'inventory/list', {
      title: res.__ ? res.__('inventory.title') : 'Inventario',
      page: 'inventory',
      vehicles: [], // placeholder
    });
    res.send(html);
  })
);

// Sobre nosotros
router.get(
  '/about',
  asyncH(async (req, res) => {
    const html = await renderAsync(res, 'pages/about', {
      title: res.__ ? res.__('common.about') : 'Sobre nosotros',
      page: 'about',
    });
    res.send(html);
  })
);

// Contáctanos
router.get(
  '/contact',
  asyncH(async (req, res) => {
    const html = await renderAsync(res, 'pages/contact', {
      title: res.__ ? res.__('common.contact') : 'Contáctanos',
      page: 'contact',
    });
    res.send(html);
  })
);

// Login (admin)
router.get(
  '/admin/login',
  asyncH(async (req, res) => {
    // Si ya está autenticado, mándalo al panel
    if (req.session?.user) return res.redirect('/admin');
    const html = await renderAsync(res, 'admin/login', {
      title: res.__ ? res.__('auth.login') : 'Ingresar',
      page: 'login',
    });
    res.send(html);
  })
);

// POST login (muestra ejemplo básico; tu lógica real puede vivir en admin.js)
router.post(
  '/admin/login',
  asyncH(async (req, res) => {
    // La validación real vive en /src/routes/admin.js; aquí solo redirigimos
    res.redirect('/admin');
  })
);
