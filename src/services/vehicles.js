// src/services/vehicles.js
import { db } from './db.js';

export async function getFeaturedVehicles(limit = 6) {
  const sql = `
    SELECT id, make, model, year, price, main_photo
    FROM vehicles
    WHERE is_published = 1
    ORDER BY created_at DESC
    LIMIT ?
  `;
  const pool = db();
  const [rows] = await pool.query(sql, [Number(limit) || 6]);
  return rows;
}

export async function searchVehicles(q = '') {
  const pool = db();
  if (!q) {
    const [rows] = await pool.query(
      `SELECT id, make, model, year, price, main_photo
       FROM vehicles
       WHERE is_published = 1
       ORDER BY created_at DESC
       LIMIT 24`
    );
    return rows;
  }
  const like = `%${q}%`;
  const [rows] = await pool.query(
    `SELECT id, make, model, year, price, main_photo
     FROM vehicles
     WHERE is_published = 1
       AND (make LIKE ? OR model LIKE ? OR vin LIKE ?)
     ORDER BY created_at DESC
     LIMIT 50`,
    [like, like, like]
  );
  return rows;
}
