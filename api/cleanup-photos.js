// api/cleanup-photos.js
// Vercel Serverless Function — Löscht Gäste-Fotos aus Cloudinary + Supabase nach Download
// Wird aufgerufen nachdem das Brautpaar die Fotos als ZIP heruntergeladen hat

const CLOUDINARY_CLOUD = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'si-weddings';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const { handleCors, requireAuth, applyRateLimit } = require('./lib/auth');

// ============================================
// CLOUDINARY DELETE
// ============================================

async function deleteFromCloudinary(publicIds) {
  // Cloudinary Admin API: Delete Resources
  // https://cloudinary.com/documentation/admin_api#delete_resources
  // Max 100 per request
  const results = { deleted: 0, failed: 0, errors: [] };

  // Chunk into batches of 100
  const chunks = [];
  for (let i = 0; i < publicIds.length; i += 100) {
    chunks.push(publicIds.slice(i, i + 100));
  }

  for (const chunk of chunks) {
    try {
      // Build auth header (Basic auth with api_key:api_secret)
      const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/resources/image/upload`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_ids: chunk,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // data.deleted = { "public_id": "deleted", ... }
        const deletedCount = Object.values(data.deleted || {}).filter(v => v === 'deleted').length;
        results.deleted += deletedCount;
        results.failed += chunk.length - deletedCount;
      } else {
        const errText = await response.text();
        console.error(`[cleanup] Cloudinary batch delete failed:`, errText);
        results.failed += chunk.length;
        results.errors.push(errText);
      }
    } catch (err) {
      console.error(`[cleanup] Cloudinary error:`, err.message);
      results.failed += chunk.length;
      results.errors.push(err.message);
    }
  }

  return results;
}

// ============================================
// SUPABASE DELETE
// ============================================

async function deleteFromSupabase(photoIds) {
  let deleted = 0;

  for (const id of photoIds) {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/photo_uploads?id=eq.${id}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=minimal',
          },
        }
      );
      if (response.ok) deleted++;
    } catch (err) {
      console.error(`[cleanup] Supabase delete failed for ${id}:`, err.message);
    }
  }

  return deleted;
}

// ============================================
// VERIFY PROJECT OWNERSHIP
// ============================================

async function verifyProject(projectId) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?id=eq.${projectId}&select=id,slug`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  if (!response.ok) return null;
  const data = await response.json();
  return data[0] || null;
}

// ============================================
// HANDLER
// ============================================

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Auth required
  const auth = requireAuth(req, res);
  if (!auth) return;

  // Rate limit: 10 req / 15 min per token email
  if (applyRateLimit(res, `cleanup-photos:${auth.email}`, 10, 15 * 60 * 1000)) return;

  try {
    const { projectId, photos } = req.body;
    // photos = [{ id, cloudinary_public_id }, ...]

    if (!projectId || !photos || !Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ error: 'projectId and photos[] required' });
    }

    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      console.error('[cleanup] Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET env vars');
      return res.status(500).json({ error: 'Cloudinary not configured for deletion' });
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('[cleanup] Missing Supabase env vars');
      return res.status(500).json({ error: 'Server not configured' });
    }

    // Safety: max 500 photos per request
    if (photos.length > 500) {
      return res.status(400).json({ error: 'Max 500 photos per request' });
    }

    // Verify project exists
    const project = await verifyProject(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`[cleanup] Deleting ${photos.length} photos for project ${projectId}`);

    // Step 1: Delete from Cloudinary
    const publicIds = photos
      .map(p => p.cloudinary_public_id)
      .filter(Boolean);

    let cloudinaryResult = { deleted: 0, failed: 0 };
    if (publicIds.length > 0) {
      cloudinaryResult = await deleteFromCloudinary(publicIds);
      console.log(`[cleanup] Cloudinary: ${cloudinaryResult.deleted} deleted, ${cloudinaryResult.failed} failed`);
    }

    // Step 2: Delete from Supabase
    const supabaseIds = photos.map(p => p.id).filter(Boolean);
    const supabaseDeleted = await deleteFromSupabase(supabaseIds);
    console.log(`[cleanup] Supabase: ${supabaseDeleted} deleted`);

    return res.status(200).json({
      success: true,
      cloudinary: {
        deleted: cloudinaryResult.deleted,
        failed: cloudinaryResult.failed,
      },
      supabase: {
        deleted: supabaseDeleted,
      },
      total: photos.length,
    });

  } catch (error) {
    console.error('[cleanup] Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
