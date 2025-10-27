import 'dotenv/config';
import { db } from '../src/services/db.js';
import { hashPassword } from '../src/services/auth.js';

const email = process.argv[2] || 'admin@lynautosales.com';
const pass = process.argv[3] || 'Admin123!';
const role = process.argv[4] || 'admin';

const pool = db();
const hash = await hashPassword(pass);
await pool.execute('INSERT INTO users(email,password_hash,role) VALUES(?,?,?)', [email, hash, role]);
console.log('Usuario creado:', email, 'rol:', role);
process.exit(0);
