// @ts-check
import { writeFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import { hiddenPaths } from './src/features';

export default defineConfig({
  // Replace with the real domain once it's connected.
  site: 'https://korinneskitchen.com',
  integrations: [
    {
      // Netlify redirects hidden pages to the homepage on the server, before any page loads.
      // "302!" is temporary (nothing is cached for good) and applies even though the page file exists.
      name: 'hidden-page-redirects',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const rules = [
            ...hiddenPaths.flatMap((path) => [`${path} / 302!`, `${path}/* / 302!`]),
            // Kitchen Notes was renamed How-To; old links keep working.
            '/kitchen-notes /how-to/ 301!',
            '/kitchen-notes/* /how-to/:splat 301!',
          ];
          await writeFile(new URL('_redirects', dir), rules.join('\n') + '\n');
        },
      },
    },
  ],
});
