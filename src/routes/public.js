import express from 'express';
import { db } from '../services/db.js';
import { body, validationResult } from 'express-validator';
import axios from 'axios';

export const router = express.Router();

router.get('/', async (req,res)=>{
  const content = await req.app.render('home', {}, (err, html)=>html);
  res.render('layout',{title:'Inicio', content, user: req.session.user });
});

router.get('/inventory', async (req,res)=>{
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
  const [rows] = await db().query(`SELECT SQL_CALC_FOUND_ROWS * FROM vehicles WHERE ${where.join(' AND ')} ORDER BY ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]);
  const [[{ 'FOUND_ROWS()': total }]] = await db().query('SELECT FOUND_ROWS()');
  const pages = Math.ceil(total/limit)||1;
  const html = await req.app.render('inventory',{ vehicles: rows, page, pages, q, year_min, year_max, status, sort }, (e,h)=>h);
  res.render('layout',{ title: req.__('common.inventory'), content: html, user:req.session.user });
});

router.get('/vehicle/:id', async (req,res)=>{
  const id = parseInt(req.params.id,10);
  const [[v]] = await db().query('SELECT * FROM vehicles WHERE id=?', [id]);
  const [photos] = await db().query('SELECT filename FROM vehicle_photos WHERE vehicle_id=? ORDER BY id', [id]);
  const html = await req.app.render('vehicle',{ v, photos }, (e,h)=>h);
  res.render('layout',{ title: 'Vehículo', content: html, user:req.session.user });
});

router.post('/vehicle/:id',
  body('name').isLength({min:2}), body('email').isEmail(),
  async (req,res)=>{
    const errors = validationResult(req);
    const id = parseInt(req.params.id,10);
    if(!errors.isEmpty()){
      return res.redirect(`/vehicle/${id}`);
    }
    const secret = process.env.RECAPTCHA_SECRET || '';
    if(secret && req.body['g-recaptcha-response']){
      try { await axios.post('https://www.google.com/recaptcha/api/siteverify', null, { params: { secret, response: req.body['g-recaptcha-response'] } }); } catch(e){}
    }
    await db().query('INSERT INTO inquiries(vehicle_id,name,email,phone,message) VALUES(?,?,?,?,?)',
      [id, req.body.name, req.body.email, req.body.phone||'', req.body.message||'']);
    res.redirect(`/vehicle/${id}`);
  }
);
