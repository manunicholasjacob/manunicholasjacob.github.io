// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// If you deploy to GitHub Pages on a custom domain, `site` drives sitemap +
// canonical URLs. Change it if the domain ever changes.
export default defineConfig({
  site: 'https://manunicholasjacob.com',
  integrations: [
    react(),
    // Legacy Wix URLs are redirects, not real pages, so keep them out of the map.
    sitemap({ filter: (page) => !/\/(projects-3|open-source|achievements|copy-of-achievements|resume|community-service|online-courses|podcasts|interviews|interests)\/?$/.test(page) }),
  ],

  // Old Wix URLs, so anything already linked or indexed keeps working.
  // Astro emits a small redirect page for each on a static build.
  redirects: {
    '/projects-3': '/research',
    '/open-source': '/projects',
    '/achievements': '/projects',
    '/copy-of-achievements': '/projects',
    '/resume': '/cv',
    '/community-service': '/service',
    '/online-courses': '/archive',
    '/podcasts': '/archive',
    '/interviews': '/archive',
    '/interests': '/archive',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
