// cors-proxy.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/sparql', async (req, res) => {
  const { endpoint, query } = req.body;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        // This matches what SPARQL endpoints like Blazegraph expect
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json',
      },
      body: `query=${encodeURIComponent(query)}`, // encode query properly
    });

    const text = await response.text();
    console.log('Response:', text);
    
    res.send(text);
  } catch (err) {
    console.error('Proxy fetch failed:', err);
    res.status(500).send('Proxy error');
  }
});

app.listen(PORT, () => {
  console.log(`CORS Proxy running on http://localhost:${PORT}`);
});