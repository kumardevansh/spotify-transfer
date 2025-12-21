// api/auth_spotify.js
export default function handler(req, res) {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const state = req.query.state || '';
  const code_challenge = req.query.code_challenge || '';
  const redirect_uri = req.query.redirect_uri || '';
  const scope = req.query.scope || 'playlist-read-private playlist-read-collaborative';
  const response_type = req.query.response_type || 'code';

  if (!CLIENT_ID) return res.status(500).send('Missing SPOTIFY_CLIENT_ID env var');

  const params = new URLSearchParams({
    response_type,
    client_id: CLIENT_ID,
    scope,
    redirect_uri,
    code_challenge,
    code_challenge_method: 'S256',
    state
  });

  res.writeHead(302, { Location: 'https://accounts.spotify.com/authorize?' + params.toString() });
  res.end();
}
