// src/routes/public.js
import express from 'express';
import { renderAsync } from '../utils/renderAsync.js';
import asyncH from '../middleware/asyncHandler.js';

export const router = express.Router();
// Helper para capturar errores async sin romper Express
const asyncH = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Home
router.get(
  '/',
  asyncH(async (req, res) => {
    const home = {
      title: 'Tu próximo auto está aquí',
      subtitle: 'Inventario verificado, precios competitivos y atención inmediata en Panama City, FL.',
      view_inventory: 'Ver inventario',
      whatsapp: 'WhatsApp',
      whatsapp_link: 'https://wa.me/1XXXXXXXXXX',
      featured_title: 'Nuevos en inventario',
      view_all: 'Ver todo'
    };

    const featured = []; // Evita ReferenceError si no hay vehículos

    const html = await renderAsync(res, 'home', {
      title: 'Inicio | LYN AutoSales',
      page: 'home',
      home,
      featured
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

export default router; 
