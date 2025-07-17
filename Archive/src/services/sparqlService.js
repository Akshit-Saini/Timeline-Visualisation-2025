export const fetchSparqlResults = async (query) => {
  const proxyUrl = "http://localhost:4000/sparql";
  const targetEndpoint = "https://virtuoso.virtualtreasury.ie/sparql/";

  const response = await fetch(proxyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/sparql-results+json",
    },
    body: JSON.stringify({
      endpoint: targetEndpoint,
      query: query,
    }),
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