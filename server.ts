import 'dotenv/config';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = Number(process.env.PORT) || 3000;
const CANONICAL_PLACEHOLDER = 'https://fudgeko.ai.studio';

interface PlacesRestReview {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

interface PlacesRestResponse {
  places?: Array<{
    id?: string;
    displayName?: { text?: string };
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    googleMapsLinks?: {
      reviewsUri?: string;
      writeAReviewUri?: string;
    };
    reviews?: PlacesRestReview[];
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

function resolveSiteOrigin(req: express.Request): string {
  const envUrl = process.env.APP_URL?.trim();
  if (envUrl && /^https?:\/\//i.test(envUrl)) {
    return envUrl.replace(/\/+$/, '');
  }
  const forwardedHost = req.get('x-forwarded-host')?.split(',')[0]?.trim();
  const host = forwardedHost || req.get('host');
  const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const proto = forwardedProto || req.protocol || 'https';
  if (host && !host.startsWith('127.0.0.1') && !host.startsWith('localhost')) {
    return `${proto}://${host}`;
  }
  return CANONICAL_PLACEHOLDER;
}

function injectCanonicalOrigin(html: string, origin: string): string {
  return html.split(CANONICAL_PLACEHOLDER).join(origin);
}

async function startServer(): Promise<void> {
  const app = express();
  app.set('trust proxy', true);

  app.get('/robots.txt', (req, res) => {
    const origin = resolveSiteOrigin(req);
    res
      .type('text/plain')
      .send(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const origin = resolveSiteOrigin(req);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${origin}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${origin}/fudgko/f1.png</image:loc>
      <image:title>Fudgeko Homemade Chocolate Fudge in Surat, Gujarat</image:title>
      <image:caption>Freshly sliced 100% eggless homemade chocolate fudge made to order in Parle Point, Surat.</image:caption>
    </image:image>
    <image:image>
      <image:loc>${origin}/assets/fudgeko_packaging.jpg</image:loc>
      <image:title>Fudgeko 250g Foil Pack Chocolate Fudge Surat</image:title>
      <image:caption>Hygienic 250g aluminum foil tray pack of Fudgeko chocolate fudge for pickup in Surat.</image:caption>
    </image:image>
  </url>
</urlset>
`;
    res.type('application/xml').send(xml);
  });

  // Same-origin Places API (New) proxy for runtime environments where VITE_* was not baked into static build
  app.get('/api/reviews', async (_req, res) => {
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: 'Google Maps API key is not configured on server.' });
      return;
    }

    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': [
            'places.id',
            'places.displayName',
            'places.rating',
            'places.userRatingCount',
            'places.googleMapsUri',
            'places.googleMapsLinks.reviewsUri',
            'places.googleMapsLinks.writeAReviewUri',
            'places.reviews',
          ].join(','),
          'X-Goog-Maps-Solution-ID': 'gmp_mcp_codeassist_v1_aistudio',
        },
        body: JSON.stringify({
          textQuery: 'Fudgeko 801 Amar Kruti Apts Parle Point Surat',
          languageCode: 'en',
          regionCode: 'IN',
          maxResultCount: 1,
          locationBias: {
            circle: {
              center: { latitude: 21.1745, longitude: 72.7935 },
              radius: 5000.0,
            },
          },
        }),
      });

      const payload = (await response.json()) as PlacesRestResponse;

      if (response.status === 429 || payload.error?.status === 'RESOURCE_EXHAUSTED') {
        res.status(429).json({
          error: payload.error?.message || 'Google Maps Platform quota exceeded',
          status: 'RESOURCE_EXHAUSTED',
        });
        return;
      }

      if (!response.ok) {
        res.status(response.status).json({
          error: payload.error?.message || `Places API error (${response.status})`,
          status: payload.error?.status,
        });
        return;
      }

      const place = payload.places?.[0];
      if (!place) {
        res.json({
          placeName: 'Fudgeko',
          rating: null,
          userRatingCount: 0,
          googleMapsUri: null,
          reviewsUri: null,
          writeAReviewUri: null,
          reviews: [],
        });
        return;
      }

      const reviews = (place.reviews ?? []).map((review) => ({
        authorName: review.authorAttribution?.displayName || 'Google User',
        authorUri: review.authorAttribution?.uri || null,
        authorPhotoUri: review.authorAttribution?.photoUri || null,
        rating: typeof review.rating === 'number' ? review.rating : 5,
        text: review.text?.text || review.originalText?.text || '',
        relativeTime: review.relativePublishTimeDescription || '',
        reviewUri: review.googleMapsUri || null,
      }));

      res.json({
        placeName: place.displayName?.text || 'Fudgeko',
        rating: typeof place.rating === 'number' ? place.rating : null,
        userRatingCount: typeof place.userRatingCount === 'number' ? place.userRatingCount : 0,
        googleMapsUri: place.googleMapsUri || null,
        reviewsUri: place.googleMapsLinks?.reviewsUri || place.googleMapsUri || null,
        writeAReviewUri: place.googleMapsLinks?.writeAReviewUri || null,
        reviews,
      });
    } catch (error) {
      console.error('Failed to fetch Google Places reviews:', error);
      res.status(502).json({ error: 'Unable to load Google reviews right now.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.get(['/', '/index.html'], async (req, res, next) => {
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        const template = await fs.readFile(indexPath, 'utf8');
        const origin = resolveSiteOrigin(req);
        const transformed = await vite.transformIndexHtml(
          req.originalUrl,
          injectCanonicalOrigin(template, origin),
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformed);
      } catch (err) {
        next(err);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    const distIndexPath = path.join(distDir, 'index.html');
    app.use(express.static(distDir, { index: false }));
    app.get('*', async (req, res, next) => {
      try {
        const template = await fs.readFile(distIndexPath, 'utf8');
        const origin = resolveSiteOrigin(req);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(injectCanonicalOrigin(template, origin));
      } catch (err) {
        next(err);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fudgeko server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Fudgeko server:', err);
  process.exit(1);
});
