export const fetchSparqlResults = async (query) => {
  // Call the backend API instead of the SPARQL endpoint directly
  const BACKEND_API = import.meta.env.VITE_BACKEND_API || "/api/sparql";

  const response = await fetch(BACKEND_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/sparql-results+json",
    },
    body: JSON.stringify({ query }),
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