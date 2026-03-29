export async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=in&viewbox=80.0,16.0,90.0,24.0&bounded=1`;
  const r = await fetch(url, { headers: { "Accept-Language": "en" } });
  return r.json();
}
