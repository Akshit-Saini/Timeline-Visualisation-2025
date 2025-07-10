export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SPARQL_ENDPOINT = 'https://virtuoso.virtualtreasury.ie/sparql/';
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Missing SPARQL query' });
  }

  try {
    const response = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/sparql-query',
        'Accept': 'application/sparql-results+json',
      },
      body: query,
    });

    if (!response.ok) {
      return res.status(500).json({ error: `SPARQL endpoint error: ${response.statusText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
} 