import express from 'express';
import { db } from '../services/db.js';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import { renderAsync } from '../utils/renderAsync.js';

export const router = express.Router();

// Home con destacados
router.get('/', async (req,res,next)=>{
  try {
    const [featured] = await db().query(
      `SELECT id, year, make, model, price, mileage, main_photo, status
       FROM vehicles ORDER BY created_at DESC LIMIT 8`
    );
    const content = await renderAsync(req.app, 'home', { featured });
    res.render('layout', { title: 'Inicio', content });
  } catch (e) { next(e); }
});

router.get('/inventory', async (req,res,next)=>{
  try{
    const { q, year_min, year_max, status, sort } = req.query;
    const page = parseInt(req.query.page || '1', 10);
    const limit = 12, offset = (page-1)*limit;
    const where = ['1=1']; const params = [];
    if(q){ where.push('(make LIKE ? OR model LIKE ? OR vin LIKE ?)'); params.push(`%${q}%`,`%${q}%`,`%${q}%`); }
    if(year_min){ where.push('year >= ?'); params.push(parseInt(year_min,10)); }
    if(year_max){ where.push('year <= ?'); params.push(parseInt(year_max,10)); }
    if(status){ where.push('status = ?'); params.push(status); }
    let order = 'created_at DESC';
    const allowed = { price_asc:'price ASC', price_desc:'price DESC', year_desc:'year DESC', year_asc:'year ASC', mileage_asc:'mileage ASC', mileage_desc:'mileage DESC' };
    if(sort && allowed[sort]) order = allowed[sort];

    const [rows] = await db().query(
      `SELECT SQL_CALC_FOUND_ROWS * FROM vehicles
       WHERE ${where.join(' AND ')}
       ORDER BY ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]
    );
    const [[{ 'FOUND_ROWS()': total }]] = await db().query('SELECT FOUND_ROWS()');
    const pages = Math.ceil(total/limit)||1;

    const html = await renderAsync(req.app, 'inventory', { vehicles: rows, page, pages, q, year_min, year_max, status, sort });
    res.render('layout', { title: req.__('common.inventory'), content: html });
  } catch(e){ next(e); }
});

router.get('/vehicle/:id', async (req,res,next)=>{
  try{
    const id = parseInt(req.params.id,10);
    const [[v]] = await db().query('SELECT * FROM vehicles WHERE id=?', [id]);
    const [photos] = await db().query('SELECT filename FROM vehicle_photos WHERE vehicle_id=? ORDER BY id', [id]);
    const html = await renderAsync(req.app, 'vehicle', { v, photos });
    res.render('layout', { title: 'Vehículo', content: html });
  } catch(e){ next(e); }
});

router.get('/about', (req,res)=> {
  res.render('layout', { title:'Sobre nosotros',
    content: `<section class="wrap pad"><h1>Sobre LYN AutoSales</h1>
      <p>Concesionario en Panama City, FL. Revisión de títulos, transparencia y atención rápida.</p>
    </section>` });
});

router.get('/contact', (req,res)=> {
  res.render('layout', { title:'Contáctanos',
    content: `<section class="wrap pad"><h1>Contáctanos</h1>
      <p>WhatsApp: <a href="https://wa.me/1XXXXXXXXXX" target="_blank">+1 XXX</a></p>
      <p>Email: ventas@lynautosales.com</p>
      <form class="contact-form" method="post" action="/contact">
        <input name="name" placeholder="Nombre" required>
        <input name="email" type="email" placeholder="Email" required>
        <textarea name="message" placeholder="Mensaje" required></textarea>
        <button class="btn">Enviar</button>
      </form>
    </section>` });
});

router.post('/vehicle/:id',
  body('name').isLength({min:2}), body('email').isEmail(),
  async (req,res,next)=>{
    try{
      const id = parseInt(req.params.id,10);
      const errors = validationResult(req);
      if(!errors.isEmpty()) return res.redirect(`/vehicle/${id}`);

      const secret = process.env.RECAPTCHA_SECRET || '';
      if(secret && req.body['g-recaptcha-response']){
        try {
          await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: { secret, response: req.body['g-recaptcha-response'] }
          });
        } catch(_) {}
      }
      await db().query(
        'INSERT INTO inquiries(vehicle_id,name,email,phone,message) VALUES(?,?,?,?,?)',
        [id, req.body.name, req.body.email, req.body.phone||'', req.body.message||'']
      );
      res.redirect(`/vehicle/${id}`);
    } catch(e){ next(e); }
  }
);
