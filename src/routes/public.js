import express from 'express';
import { renderAsync } from '../utils/renderAsync.js';

export const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // 🔹 Usa req.__() para obtener traducciones desde es.json / en.json
    const html = await renderAsync(res, 'home', {
      title: req.__('home.meta_title') || 'LYN AutoSales',
      home: {
        title: req.__('home.title'),
        subtitle: req.__('home.subtitle'),
        view_inventory: req.__('home.view_inventory'),
        whatsapp_cta: req.__('home.whatsapp_cta'),
        advantages: {
          time: req.__('home.advantages.time'),
          reviewed: req.__('home.advantages.reviewed'),
          finance: req.__('home.advantages.finance'),
        },
        new_inventory: req.__('home.new_inventory'),
        sell_offer: req.__('home.sell_offer'),
      },
      featured: [],
      latest: [],
    });

    res.send(html);
  } catch (err) {
    next(err);
  }
});

export default router;
