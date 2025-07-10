export const fetchSparqlResults = async (query) => {
  // Use environment variable, fallback to public endpoint
  const SPARQL_ENDPOINT = import.meta.env.VITE_SPARQL_ENDPOINT || "https://virtuoso.virtualtreasury.ie/sparql/";

  const response = await fetch(SPARQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-query",
      "Accept": "application/sparql-results+json",
    },
    body: query,
  });

  if (!response.ok) {
    throw new Error(`SPARQL fetch failed with status ${response.status}`);
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};