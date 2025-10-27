import express from 'express';
import { db } from '../services/db.js';
import { requireLogin, requireRole, verifyPassword } from '../services/auth.js';
import { upload, makeThumbIfImage } from '../services/upload.js';
import { parse } from 'csv-parse';
import fs from 'fs';

export const router = express.Router();

router.get('/login', (req,res)=>{
  if (req.session.user) return res.redirect('/admin');
  req.app.render('admin/login',{},(e,html)=>{
    res.render('layout',{title:'Login', content: html, user:null});
  });
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const [[u]] = await db().query('SELECT * FROM users WHERE email=? LIMIT 1', [email]);
  if(u && await verifyPassword(password, u.password_hash)){
    req.session.user = { id: u.id, email: u.email, role: u.role };
    return res.redirect('/admin');
  }
  req.app.render('admin/login',{ error:'Credenciales inválidas' },(e,html)=>{
    res.render('layout',{title:'Login', content: html, user:null});
  });
});

router.get('/logout',(req,res)=>{ req.session.destroy(()=> res.redirect('/')); });

router.get('/', requireLogin, async (req,res)=>{
  const [[{count: vehicles}]] = await db().query('SELECT COUNT(*) AS count FROM vehicles');
  const [[{count: inquiries}]] = await db().query('SELECT COUNT(*) AS count FROM inquiries');
  const html = await new Promise(r=> req.app.render('admin/dashboard',{ stats:{vehicles, inquiries} }, (e,h)=>r(h)));
  res.render('layout',{ title: 'Admin', content: html, user:req.session.user });
});

// list
router.get('/vehicles', requireLogin, async (req,res)=>{
  const [rows] = await db().query('SELECT id,year,make,model,price,status FROM vehicles ORDER BY created_at DESC');
  const html = await new Promise(r=> req.app.render('admin/vehicles',{ rows }, (e,h)=>r(h)));
  res.render('layout',{ title:'Vehículos', content: html, user:req.session.user });
});

router.get('/vehicles/new', requireRole(['manager','lister']), async (req,res)=>{
  const html = await new Promise(r=> req.app.render('admin/vehicle_form',{ v:null, photos:[] }, (e,h)=>r(h)));
  res.render('layout',{ title:'Nuevo vehículo', content: html, user:req.session.user });
});

const multiUpload = upload.fields([
  { name:'main_photo', maxCount:1},
  { name:'gallery', maxCount:16},
  { name:'video', maxCount:1}
]);

router.post('/vehicles/new', requireRole(['manager','lister']), multiUpload, async (req,res)=>{
  const b = req.body;
  const [result] = await db().query(
    'INSERT INTO vehicles(year,make,model,price,mileage,vin,title_status,transmission,fuel_type,location,status,description,main_photo,video) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [b.year, b.make, b.model, b.price||0, b.mileage||0, b.vin||'', b.title_status||'clean', b.transmission||'', b.fuel_type||'', b.location||'', b.status||'available', b.description||'', (req.files['main_photo']?.[0]?.filename)||null, (req.files['video']?.[0]?.filename)||null ]
  );
  const vid = result.insertId;
  if(req.files['gallery']){
    for(const f of req.files['gallery']){
      await db().query('INSERT INTO vehicle_photos(vehicle_id, filename) VALUES(?,?)', [vid, f.filename]);
      await makeThumbIfImage('uploads/images/'+f.filename);
    }
  }
  if(req.files['main_photo']) await makeThumbIfImage('uploads/images/'+req.files['main_photo'][0].filename);
  res.redirect('/admin/vehicles/'+vid+'/edit');
});

router.get('/vehicles/:id/edit', requireRole(['manager','lister']), async (req,res)=>{
  const id = parseInt(req.params.id,10);
  const [[v]] = await db().query('SELECT * FROM vehicles WHERE id=?',[id]);
  const [photos] = await db().query('SELECT * FROM vehicle_photos WHERE vehicle_id=? ORDER BY id DESC',[id]);
  const html = await new Promise(r=> req.app.render('admin/vehicle_form',{ v, photos }, (e,h)=>r(h)));
  res.render('layout',{ title:'Editar vehículo', content: html, user:req.session.user });
});

router.post('/vehicles/:id/edit', requireRole(['manager','lister']), multiUpload, async (req,res)=>{
  const id = parseInt(req.params.id,10);
  const b = req.body;
  const fields = ['year','make','model','price','mileage','vin','title_status','transmission','fuel_type','location','status','description'];
  const sets = fields.map(f=> `${f}=?`);
  const params = [b.year,b.make,b.model,b.price||0,b.mileage||0,b.vin||'',b.title_status||'clean',b.transmission||'',b.fuel_type||'',b.location||'',b.status||'available',b.description||''];
  if (req.files['main_photo']?.[0]) { sets.push('main_photo=?'); params.push(req.files['main_photo'][0].filename); }
  if (req.files['video']?.[0]) { sets.push('video=?'); params.push(req.files['video'][0].filename); }
  params.push(id);
  await db().query(`UPDATE vehicles SET ${sets.join(', ')} WHERE id=?`, params);
  if(req.files['gallery']){
    for(const f of req.files['gallery']){
      await db().query('INSERT INTO vehicle_photos(vehicle_id, filename) VALUES(?,?)', [id, f.filename]);
      await makeThumbIfImage('uploads/images/'+f.filename);
    }
  }
  if(req.files['main_photo']) await makeThumbIfImage('uploads/images/'+req.files['main_photo'][0].filename);
  res.redirect('/admin/vehicles/'+id+'/edit');
});

// delete restricted to admin/manager
router.post('/vehicles/:id/delete', requireRole(['manager']), async (req,res)=>{
  const id = parseInt(req.params.id,10);
  await db().query('DELETE FROM vehicles WHERE id=?',[id]);
  res.redirect('/admin/vehicles');
});

router.get('/import', requireRole(['manager']), async (req,res)=>{
  const html = await new Promise(r=> req.app.render('admin/import',{},(e,h)=>r(h)));
  res.render('layout',{ title:'Importar CSV', content: html, user:req.session.user });
});

router.post('/import', requireRole(['manager']), upload.single('csv'), async (req,res)=>{
  const rows = [];
  const stream = fs.createReadStream(req.file.path).pipe(parse({columns:true, trim:true}));
  for await (const rec of stream){ rows.push(rec); }
  for (const r of rows){
    await db().query(
      'INSERT INTO vehicles(year,make,model,price,mileage,vin,title_status,transmission,fuel_type,location,status,description) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
      [r.year, r.make, r.model, r.price||0, r.mileage||0, r.vin||'', r.title_status||'clean', r.transmission||'', r.fuel_type||'', r.location||'', r.status||'available', r.description||'']
    );
  }
  res.redirect('/admin/vehicles');
});
