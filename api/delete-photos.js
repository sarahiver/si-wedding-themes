// api/delete-photos.js
// Vercel Serverless Function — Cloudinary Fotos löschen
// Benötigt ENV: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    console.error('Missing Cloudinary credentials:', { CLOUD_NAME: !!CLOUD_NAME, API_KEY: !!API_KEY, API_SECRET: !!API_SECRET });
    return res.status(500).json({ error: 'Cloudinary nicht konfiguriert' });
  }

  const { public_ids } = req.body;

  if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
    return res.status(400).json({ error: 'public_ids array required' });
  }

  // Max 100 per request
  if (public_ids.length > 100) {
    return res.status(400).json({ error: 'Max 100 photos per request' });
  }

  const results = { deleted: [], failed: [] };

  // Delete each photo via Cloudinary Admin API
  for (const publicId of public_ids) {
    try {
      const timestamp = Math.round(Date.now() / 1000);
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;

      // Generate SHA-1 signature
      const crypto = await import('crypto');
      const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

      const formData = new URLSearchParams();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp);
      formData.append('api_key', API_KEY);
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.result === 'ok' || data.result === 'not found') {
        results.deleted.push(publicId);
      } else {
        results.failed.push({ publicId, error: data.result || 'unknown' });
      }
    } catch (err) {
      results.failed.push({ publicId, error: err.message });
    }
  }

  return res.status(200).json({
    success: true,
    deleted: results.deleted.length,
    failed: results.failed.length,
    details: results,
  });
}
