// api/og.js
// Vercel Serverless Function — Dynamic OG Meta Tags for Social Media Crawlers
// Returns minimal HTML with correct <meta> tags for Facebook, WhatsApp, Twitter, etc.
// Uses Cloudinary text overlay for automatic OG image generation.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const CLOUDINARY_CLOUD = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'si-weddings';

// Fallback OG image per theme (generic S&I branded)
const FALLBACK_OG_IMAGES = {
  editorial: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/v1/og-fallback/editorial.jpg`,
  botanical: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/v1/og-fallback/botanical.jpg`,
  contemporary: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/v1/og-fallback/contemporary.jpg`,
  luxe: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/v1/og-fallback/luxe.jpg`,
  neon: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/v1/og-fallback/neon.jpg`,
  video: `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/v1/og-fallback/video.jpg`,
};
const DEFAULT_FALLBACK = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/v1/og-fallback/default.jpg`;

// ============================================
// SUPABASE: Fetch project + hero content
// ============================================
async function getProjectData(slug) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;

  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
  };

  // Fetch project by slug
  const projectRes = await fetch(
    `${SUPABASE_URL}/rest/v1/projects?slug=eq.${encodeURIComponent(slug)}&select=id,slug,couple_names,wedding_date,location,theme`,
    { headers }
  );

  if (!projectRes.ok) return null;

  const projects = await projectRes.json();
  const project = projects[0];
  if (!project) return null;

  // Fetch hero content for this project
  const contentRes = await fetch(
    `${SUPABASE_URL}/rest/v1/project_content?project_id=eq.${project.id}&component=eq.hero&select=content`,
    { headers }
  );

  let heroContent = {};
  if (contentRes.ok) {
    const contentRows = await contentRes.json();
    if (contentRows[0]) {
      heroContent = contentRows[0].content || {};
    }
  }

  return { ...project, heroContent };
}

// ============================================
// BUILD CLOUDINARY OG IMAGE URL
// ============================================
function buildOgImageUrl(coupleNames, dateStr, heroImageUrl) {
  // If no hero image, return null (caller uses fallback)
  if (!heroImageUrl) return null;

  // Extract Cloudinary public ID from URL
  // Expected format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{path}
  const cloudinaryMatch = heroImageUrl.match(
    /res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)$/
  );

  if (!cloudinaryMatch) return null;

  const publicId = cloudinaryMatch[1];
  const encodedNames = encodeURIComponent(coupleNames || 'Hochzeit');
  const encodedDate = encodeURIComponent(dateStr || '');

  // Build Cloudinary transformation URL with text overlays
  const transformations = [
    'w_1200,h_630,c_fill',
    'co_white,l_text:Playfair%20Display_60_bold:' + encodedNames + ',g_center,y_-30',
    ...(dateStr ? ['co_white,l_text:Inter_28:' + encodedDate + ',g_center,y_50'] : []),
  ].join('/');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${transformations}/${publicId}`;
}

// ============================================
// FORMAT DATE
// ============================================
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ============================================
// HTML ESCAPING
// ============================================
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================
// HANDLER
// ============================================
export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).send('Missing slug parameter');
  }

  const project = await getProjectData(slug);

  // Fallback values
  const coupleNames = project?.couple_names || 'S&I Wedding';
  const dateFormatted = formatDate(project?.wedding_date);
  const location = project?.location || '';
  const theme = project?.theme || 'editorial';
  const heroImage = project?.heroContent?.background_image || '';

  // Build description
  const descParts = ['Wir heiraten!'];
  if (dateFormatted) descParts.push(dateFormatted);
  if (location) descParts.push(location);
  const description = descParts.join(' — ');

  // Build OG image: Cloudinary overlay or theme fallback
  const overlayUrl = buildOgImageUrl(coupleNames, dateFormatted, heroImage);
  const ogImage = overlayUrl || FALLBACK_OG_IMAGES[theme] || DEFAULT_FALLBACK;

  const canonicalUrl = `https://${esc(slug)}.siwedding.de`;

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <title>${esc(coupleNames)} — Hochzeit</title>
  <meta property="og:title" content="${esc(coupleNames)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(coupleNames)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  <meta http-equiv="refresh" content="0;url=${canonicalUrl}" />
</head>
<body></body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(html);
}
