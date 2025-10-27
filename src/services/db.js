import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool;
export function db(){
  if(!pool){
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'autosales',
      waitForConnections: true,
      connectionLimit: 10
    });
  }
  return pool;
}
