// api/exchange_google.js
// Vercel serverless function using built-in fetch (Node 18+)

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const origin = req.headers.origin || '';
    if (!origin.includes('spotify-transfer-chi.vercel.app')) {
      return res.status(403).json({ error: 'Forbidden origin' });
    }

    if (!req.headers['content-type']?.includes('application/json')) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown';

    global.rateLimit = global.rateLimit || new Map();

    const now = Date.now();
    const windowMs = 60_000;
    const maxRequests = 10;

    const timestamps = global.rateLimit.get(ip) || [];
    const recent = timestamps.filter(t => now - t < windowMs);

    if (recent.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    recent.push(now);
    global.rateLimit.set(ip, recent);

    const { code, code_verifier } = req.body || {};
    if (!code) {
      return res.status(400).json({ error: 'missing code in request body' });
    }

    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
      console.error("Missing env vars", {
        CLIENT_ID: !!CLIENT_ID,
        CLIENT_SECRET: !!CLIENT_SECRET,
        REDIRECT_URI: !!REDIRECT_URI
      });
      return res.status(500).json({
        error: "Server misconfiguration: missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / REDIRECT_URI"
      });
    }

    const params = new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      ...(code_verifier ? { code_verifier } : {})
    });

    const googleRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const googleData = await googleRes.json();

    if (!googleRes.ok) {
      console.error("Google token endpoint error", googleData);
      return res.status(502).json({
        error: "google_token_error",
        details: googleData,
        status: googleRes.status
      });
    }

    return res.status(200).json(googleData);

  } catch (err) {
    console.error("Exchange error:", err);
    return res.status(500).json({
      error: "internal_server_error",
      message: err.message || String(err)
    });
  }
}
