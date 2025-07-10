import fetch from 'node-fetch';
const BASE_URL = 'https://beyond2022.vercel.app/api/preload'; // <-- CHANGE THIS to your actual Vercel URL
const minYear = 310;
const maxYear = 2025;
const step = 10; // Should match your backend logic

async function preloadRange(from, to) {
  const url = `${BASE_URL}?from=${from}&to=${to}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(`Range ${from}-${to}:`, data.status, data.statusText || data.error || '');
  } catch (err) {
    console.error(`Range ${from}-${to}: ERROR`, err.message);
  }
}

(async () => {
  for (let from = minYear; from < maxYear; from += step) {
    let to = Math.min(from + step, maxYear);
    await preloadRange(from, to);
    // Optional: wait 1 second between requests to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
})(); 