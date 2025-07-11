import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const SPARQL_ENDPOINT = 'https://virtuoso.virtualtreasury.ie/sparql/';

app.use(cors());
app.use(express.json());

app.post('/api/sparql', async (req, res) => {
  const { query } = req.body;
  try {
    const response = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/sparql-results+json',
      },
      body: query,
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 