// src/components/shared/SEOHead.js
// Dynamische SEO Meta-Tags, Open Graph, Canonical URL und JSON-LD Schema
// Wird per useEffect ins <head> injiziert – kein React Helmet nötig
import { useEffect } from 'react';

const BASE_URL = 'https://sarahiver.com';
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/si-weddings/image/upload/v1770798416/si_og_image_nx5blq.png';

const SEOHead = ({
  title = 'S&I. — Premium Hochzeitswebsites',
  description = 'S&I. — Premium Hochzeitswebsites mit eigenem Design, eigener Domain, digitalem RSVP und Foto-Upload. Einzigartige Themes. Ab 1.290€. Aus Hamburg.',
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  schema = null,
  keywords = null,
  noIndex = false,
}) => {
  useEffect(() => {
    // --- Document Title ---
    document.title = title;

    // --- Helper: set or create meta tag ---
    const setMeta = (attr, attrValue, content) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      return el;
    };

    // --- Meta Description ---
    setMeta('name', 'description', description);

    // --- Meta Keywords ---
    if (keywords && keywords.length > 0) {
      setMeta('name', 'keywords', keywords.join(', '));
    }

    // --- Robots ---
    if (noIndex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    } else {
      // Remove noindex if present
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.content.includes('noindex')) {
        robotsMeta.remove();
      }
    }

    // --- Canonical URL ---
    const canonicalUrl = `${BASE_URL}${path}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // --- Open Graph ---
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:locale', 'de_DE');
    setMeta('property', 'og:site_name', 'S&I.');

    // --- Twitter Card ---
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // --- JSON-LD Schema ---
    // Remove old schema first
    const oldSchema = document.querySelector('script[data-seo-schema]');
    if (oldSchema) oldSchema.remove();

    if (schema) {
      const schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('data-seo-schema', 'true');
      schemaScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        ...schema,
      });
      document.head.appendChild(schemaScript);
    }

    // --- Cleanup on unmount ---
    return () => {
      const schemaEl = document.querySelector('script[data-seo-schema]');
      if (schemaEl) schemaEl.remove();
    };
  }, [title, description, path, image, type, schema, keywords, noIndex]);

  return null; // Renders nothing – only side effects
};

export default SEOHead;
