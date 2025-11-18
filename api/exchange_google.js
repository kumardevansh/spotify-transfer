// api/exchange_google.js  (Vercel Serverless function)
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code, code_verifier } = req.body || {};
  if (!code) return res.status(400).json({ error: 'missing code' });

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI; // must match the redirect URI you used in OAuth flow

  try {
    const params = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
      code_verifier: code_verifier || ''
    });

    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('Google token error', data);
      return res.status(500).json({ error: data });
    }
    // return tokens (access_token, refresh_token, expires_in, id_token, etc.)
    return res.status(200).json(data);
  } catch (err) {
    console.error('exchange error', err);
    return res.status(500).json({ error: err.message || err });
  }
};
