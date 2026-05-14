import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db/pool.js';
import playerRoutes from './routes/playerRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import liveStatsRoutes from './routes/liveStatsRoutes.js';
const app = express();
app.use(cors());
app.use(express.json());

pool.connect()
  .then(client => {
    console.log('Database connected');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

app.get('/', (req: Request, res: Response) => {
  res.json('Welcome to the Players API');
});

app.use('/players', playerRoutes);
app.use('/matches', matchRoutes);
app.use('/live-stats', liveStatsRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
