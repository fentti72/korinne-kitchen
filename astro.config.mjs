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
          const rules = hiddenPaths.flatMap((path) => [`${path} / 302!`, `${path}/* / 302!`]);
          await writeFile(new URL('_redirects', dir), rules.join('\n') + '\n');
        },
      },
    },
  ],
});
