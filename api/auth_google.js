// api/auth_google.js
export default function handler(req, res) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const state = req.query.state || '';
  const code_challenge = req.query.code_challenge || '';
  const redirect_uri = req.query.redirect_uri || '';
  const scope = req.query.scope || 'https://www.googleapis.com/auth/youtube';
  const response_type = req.query.response_type || 'code';
  const access_type = req.query.access_type || 'offline';
  const include_granted_scopes = req.query.include_granted_scopes || 'true';

  if (!CLIENT_ID) return res.status(500).send('Missing GOOGLE_CLIENT_ID env var');

  const params = new URLSearchParams({
    response_type,
    client_id: CLIENT_ID,
    scope,
    redirect_uri,
    state,
    code_challenge,
    code_challenge_method: 'S256',
    access_type,
    include_granted_scopes
  });

  res.writeHead(302, { Location: 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString() });
  res.end();
}
