const BACKEND_API = import.meta.env.VITE_SPARQL_ENDPOINT || 'http://localhost:4000/sparql';

export const fetchSparqlResults = async (query) => {
  // If using the Virtuoso endpoint directly, send the query as raw text
  const isVirtuoso = BACKEND_API.includes('virtuoso.virtualtreasury.ie');
  const fetchUrl = BACKEND_API;
  const fetchOptions = isVirtuoso
    ? {
        method: "POST",
        headers: {
          "Content-Type": "application/sparql-query",
          "Accept": "application/sparql-results+json",
        },
        body: query,
      }
    : {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/sparql-results+json",
        },
        body: JSON.stringify({
          endpoint: 'https://virtuoso.virtualtreasury.ie/sparql/',
          query
        }),
      };

  const response = await fetch(fetchUrl, fetchOptions);
  if (!response.ok) throw new Error(`SPARQL fetch failed with status ${response.status}`);
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};