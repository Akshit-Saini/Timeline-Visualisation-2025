// cors-proxy.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors({
  origin: 'https://beyond2022.vercel.app'
}));
app.use(express.text({ type: '*/*' }));

app.all('/sparql', async (req, res) => {
  const url = 'https://virtuoso-deploy-production.up.railway.app/sparql';
  const method = req.method;
  const headers = { ...req.headers };
  delete headers['host'];
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: req.method === 'GET' ? undefined : req.body
    });
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding') res.setHeader(key, value);
    });
    response.body.pipe(res);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));