import bcrypt from 'bcrypt';

export async function verifyPassword(plain, hash){
  return bcrypt.compare(plain, hash);
}
export async function hashPassword(plain){
  const saltRounds = 10;
  return bcrypt.hash(plain, saltRounds);
}
export function requireLogin(req,res,next){
  if(!req.session.user){ return res.redirect('/admin/login'); }
  next();
}

// RBAC helper
export function requireRole(roles){
  const allow = Array.isArray(roles) ? roles : [roles];
  return (req,res,next)=>{
    const user = req.session.user;
    if(!user){ return res.redirect('/admin/login'); }
    if(allow.includes(user.role) || user.role === 'admin'){ return next(); }
    return res.status(403).send('No autorizado');
  };
}
