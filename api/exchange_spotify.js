// api/exchange_spotify.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin || '';
  if (!origin.includes('spotify-transfer-chi.vercel.app/')) {
    return res.status(403).json({ error: 'Forbidden origin' });
  }

  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(400).json({ error: 'Invalid content type' });
  }

    // ✅ BASIC RATE LIMIT (ADD THIS)
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown';

  global.rateLimit = global.rateLimit || new Map();

  const now = Date.now();
  const windowMs = 60_000; // 1 minute
  const maxRequests = 10;

  const timestamps = global.rateLimit.get(ip) || [];
  const recent = timestamps.filter(t => now - t < windowMs);

  if (recent.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  recent.push(now);
  global.rateLimit.set(ip, recent);


  const { code, code_verifier } = req.body || {};
  if (!code || !code_verifier) {
    return res.status(400).json({ error: 'Missing code or verifier' });
  }

  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  if (!CLIENT_ID || !REDIRECT_URI) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier
  });

  const spotifyRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const data = await spotifyRes.json();

  if (!spotifyRes.ok) {
    return res.status(502).json({ error: 'spotify_token_error', details: data });
  }

  res.status(200).json(data);
}
