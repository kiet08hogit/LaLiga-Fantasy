import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env is at backend/.env relative to src/db -> up two levels
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// coerce and sanitize env values explicitly
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = String(process.env.DB_PASSWORD ?? '').trim();
const DB_PORT = Number(process.env.DB_PORT) || 5432;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

export default pool;
