import axios from 'axios';

const endpoint = process.env.REACT_APP_SPARQL_ENDPOINT;

export const runQuery = async (query) => {
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const body = `query=${encodeURIComponent(query)}`;
  try {
    const response = await axios.post(endpoint, body, { headers });
    return response.data.results.bindings;
  } catch (error) {
    console.error('SPARQL query failed:', error);
    return [];
  }
};