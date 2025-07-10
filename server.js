import express from 'express';
import Redis from 'ioredis';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(cors());
app.use(express.json());

// API: Query SPARQL with caching (now Redis-only)
app.post('/api/sparql', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const cacheKey = `sparql:${Buffer.from(query).toString('base64')}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  return res.status(404).json({ error: 'Data not preloaded in Redis' });
});

// API: Preload all data (admin use)
app.post('/api/preload', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const cacheKey = `sparql:${Buffer.from(query).toString('base64')}`;
  try {
    const data = await redis.set(cacheKey, JSON.stringify(data), 'EX', 86400); // 1 day
    res.json({ status: 'preloaded', key: cacheKey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 