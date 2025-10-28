import { Router } from 'express';
import { renderLayout } from '../utils/renderAsync.js';
import { getFeaturedVehicles, searchVehicles } from '../services/vehicles.js';

export const router = Router();

// Home
router.get('/', async (req, res, next) => {
  try {
    const featured = await getFeaturedVehicles(6);
    await renderLayout(res, 'home', {
      title: req.__('home.meta.title'),
      meta_description: req.__('home.meta.description'),
      featured
    });
  } catch (err) { next(err); }
});

// Inventario
router.get('/inventory', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const results = await searchVehicles(q);
    await renderLayout(res, 'inventory', {
      title: req.__('inventory.title'),
      q, results
    });
  } catch (err) { next(err); }
});

// Sobre nosotros
router.get('/about', async (req, res, next) => {
  try {
    await renderLayout(res, 'about', {
      title: req.__('about.title')
    });
  } catch (err) { next(err); }
});

// Contacto
router.get('/contact', async (req, res, next) => {
  try {
    await renderLayout(res, 'contact', {
      title: req.__('contact.title')
    });
  } catch (err) { next(err); }
});
