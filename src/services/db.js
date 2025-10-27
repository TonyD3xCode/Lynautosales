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
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),   // <-- puerto desde env
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      multipleStatements: true
    });
  }
  return pool;
}

export async function initSchema() {
  const conn = await db().getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS _migrations(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(190) UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    const schema = fs.readFileSync(path.resolve('schema.sql'), 'utf8');
    await conn.query(schema); // usa CREATE TABLE IF NOT EXISTS en schema.sql
  } finally {
    conn.release();
  }
}
