import express from 'express';
import cors from 'cors';
import pool from './db/pool.js';
import playerRoutes from './routes/playerRoutes.js';
import teamRoutes from './routes/teamRoutes.js';

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

app.get('/', (req, res) => {
  res.json('Welcome to the Players API');
});

app.use('/players', playerRoutes);
app.use('/team', teamRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
