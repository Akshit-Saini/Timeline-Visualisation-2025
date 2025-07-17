const BACKEND_API = 'https://vrti-demo.walter-wm.de/virtuoso/sparql';

export const fetchSparqlResults = async (query) => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/sparql-results+json",
    },
    body: new URLSearchParams({ query }).toString(),
  };

  const response = await fetch(BACKEND_API, fetchOptions);
  if (!response.ok) throw new Error(`SPARQL fetch failed with status ${response.status}`);
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};