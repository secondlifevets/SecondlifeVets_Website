import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vetsondoor.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin',
          '/api/',
          '/api',
          '/dashboard/',
          '/dashboard',
          '/auth/',
          '/auth',
          '/login/',
          '/login',
          '/reset-password/',
          '/reset-password',
        ],
      },
      {
        // Explicitly allow AI search engine bots for GEO
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'anthropic-ai',
          'Claude-Web',
          'PerplexityBot',
          'Applebot-Extended',
        ],
        allow: ['/', '/llms.txt'],
      },
      {
        // Block only pure data-scraping bots (not AI search engines)
        userAgent: [
          'CCBot',
          'Omgilibot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
