import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://memvo.io/</loc>
      <lastmod>2024-10-10</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
    </url>
    
    <url>
      <loc>https://memvo.io/record</loc>
      <lastmod>2024-10-10</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
    </url>
  </urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
