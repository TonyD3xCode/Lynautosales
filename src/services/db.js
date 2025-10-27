// src/services/db.js
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

let pool;
export function db() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'mysql-bk8t.railway.internal',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'DVEQPpEGuJqpDyoChXclPHnYiUbNoPbH',
      database: process.env.DB_NAME || 'railway',
      waitForConnections: true,
      connectionLimit: 10,
      multipleStatements: true // necesario para ejecutar schema.sql completo
    });
  }
  return pool;
}

// Ejecuta schema.sql la primera vez y asegura tablas en cada arranque
export async function initSchema() {
  const pool = db();
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(190) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Lee y ejecuta schema.sql (idempotente porque usa IF NOT EXISTS)
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await conn.query(sql);

    // Marca esta versión de esquema (opcional)
    const migName = 'initial_schema_v1';
    await conn.query(
      'INSERT IGNORE INTO _migrations(name) VALUES (?)',
      [migName]
    );

    // Semilla opcional: crea admin si no existe y hay variables en .env
    if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_HASH) {
      await conn.query(`
        INSERT IGNORE INTO users(email, password_hash, role)
        VALUES (?, ?, 'admin')
      `, [process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_HASH]);
    }
  } finally {
    conn.release();
  }
}
