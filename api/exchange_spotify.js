// api/exchange_spotify.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
