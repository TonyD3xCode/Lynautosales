import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const base = file.mimetype.startsWith('video/') ? 'uploads/videos' : 'uploads/images';
    fs.mkdirSync(base, {recursive:true});
    cb(null, base);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = Date.now() + '_' + Math.random().toString(36).slice(2) + ext;
    cb(null, safe);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 }, // 80MB per file
  fileFilter: (req,file,cb)=>{
    const isImg = /image\/(jpeg|png|webp)/.test(file.mimetype);
    const isVid = /video\/(mp4|webm|ogg)/.test(file.mimetype);
    if(isImg || isVid) cb(null,true);
    else cb(new Error('Tipo de archivo no permitido'));
  }
});

export async function makeThumbIfImage(filepath){
  try{
    const out = filepath.replace(/(\.[a-z0-9]+)$/i, '_thumb.webp');
    await sharp(filepath).resize(800).webp({quality: 82}).toFile(out);
    return out;
  }catch(e){ return null; }
}
