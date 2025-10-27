// tools/create_admin.js
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from '../src/services/db.js';

async function main() {
  try {
    // Permite pasar args: node tools/create_admin.js email pass role
    const [, , emailArg, passArg, roleArg] = process.argv;

    const email = emailArg || 'admin@lyn.com';
    const password = passArg || 'TuClaveFuerte123!';
    const role = roleArg || 'admin';

    if (!email || !password) {
      console.log('Uso: node tools/create_admin.js <email> <password> [role]');
      process.exit(1);
    }

    // Comprueba si ya existe
    const [exists] = await db().query('SELECT id FROM users WHERE email=? LIMIT 1', [email]);
    if (exists.length) {
      console.log(`✅ Admin ya existe: ${email}. No se crea de nuevo.`);
      process.exit(0);
    }

    // Hash y create
    const hash = await bcrypt.hash(password, 10);
    await db().query(
      'INSERT INTO users(email, password_hash, role) VALUES (?, ?, ?)',
      [email, hash, role]
    );

    console.log(`✅ Admin creado: ${email} (role: ${role})`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creando admin:', err);
    process.exit(1);
  }
}

await main();
