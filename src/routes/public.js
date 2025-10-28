import { Router } from 'express';
import { renderLayout } from '../utils/renderAsync.js';
import { getFeaturedVehicles, searchVehicles } from '../services/vehicles.js';

export const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const featured = await getFeaturedVehicles(6);
    await renderLayout(req, res, 'home', {
      title: req.__('home.meta.title'),
      meta_description: req.__('home.meta.description'),
      featured
    });
  } catch (err) {
    next(err);
  }
});

router.get('/inventory', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const results = await searchVehicles(q);
    await renderLayout(req, res, 'inventory', {
      title: req.__('inventory.title'),
      q,
      results
    });
  } catch (err) {
    next(err);
  }
});

router.get('/about', async (req, res, next) => {
  try {
    await renderLayout(req, res, 'about', {
      title: req.__('about.title')
    });
  } catch (err) {
    next(err);
  }
});

router.get('/contact', async (req, res, next) => {
  try {
    await renderLayout(req, res, 'contact', {
      title: req.__('contact.title')
    });
  } catch (err) {
    next(err);
  }
});
