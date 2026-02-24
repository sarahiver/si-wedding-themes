// api/auth/verify.js
// Vercel Serverless Function — Password verification + token issuance
// Verifies admin/preview/guest passwords via Supabase RPC and returns a signed token

const { handleCors, createToken, applyRateLimit, getClientIP } = require('../lib/auth');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function callSupabaseRPC(functionName, params) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[verify] RPC ${functionName} failed:`, errText);
    return { success: false, error: 'Server error' };
  }

  return await response.json();
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limit: 5 requests / 15 min per IP
  const ip = getClientIP(req);
  if (applyRateLimit(res, `verify:${ip}`, 5, 15 * 60 * 1000)) return;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const { slug, password, type } = req.body;

  if (!slug || !password) {
    return res.status(400).json({ error: 'slug and password required' });
  }

  const validTypes = ['admin', 'preview', 'guest'];
  const authType = validTypes.includes(type) ? type : 'guest';

  try {
    let result;

    switch (authType) {
      case 'admin':
        result = await callSupabaseRPC('verify_admin_password', {
          project_slug: slug,
          input_password: password,
        });
        break;
      case 'preview':
        result = await callSupabaseRPC('verify_preview_password', {
          project_slug: slug,
          input_password: password,
        });
        break;
      default: // guest
        result = await callSupabaseRPC('verify_project_password', {
          project_slug: slug,
          input_password: password,
        });
    }

    if (result?.success) {
      const token = createToken(`${authType}@${slug}`, slug);
      return res.status(200).json({ success: true, token });
    }

    return res.status(401).json({ success: false, error: result?.error || 'Invalid password' });

  } catch (error) {
    console.error('[verify] Error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
}
