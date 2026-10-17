# Korinne's Kitchen

The website for Korinne, a chef in Flower Mound, Texas: How-To (blog, formerly Kitchen Notes), signature dishes, recipes, in-person classes, and weekly pickup bake drops.

- **Site:** [Astro](https://astro.build), hosted on Cloudflare (settings in `wrangler.jsonc`).
- **Editing:** [Pages CMS](https://pagescms.org) (configured in `.pages.yml`). Content lives in `src/content/`.
- **Payments:** Stripe Checkout (not wired up yet).

## Pages

| Page | Path | Content lives in |
|---|---|---|
| Home | `/` | pulls from classes, bake drops, posts, gallery |
| How-To | `/how-to/` (+ tag pages) | `src/content/posts` |
| Signature dishes | `/gallery/` | `src/content/gallery` |
| Recipes | `/recipes/` | `src/content/recipes` |
| Take a Class | `/classes/` | `src/content/classes` |
| What I'm Baking | `/bake/` | `src/content/bakes` |
| About | `/about/` | `src/pages/about.astro` |
| Policies | `/policies/` | `src/data/policies.yaml` |

Photos are in `src/assets/photos`; `scripts/crop-photos.py` records how each was cropped.
Run `npm run check:contrast` after changing any color in `src/styles/tokens.css`.

## Hiding classes, bake sales, and the gallery

`src/features.ts` has switches for `classes`, `bake`, and `gallery`. While one is `false`, its nav link, page, homepage card,
and every mention elsewhere are hidden, and its page redirects to the homepage (Cloudflare `_redirects`, generated at
build). Set it back to `true` to bring it all back. Content in the editor is kept either way.

## Privacy rule

Never put the home address in this repository or on the site. Only the area ("Flower Mound, Texas") is public. The address and parking notes are stored as a server secret and appear only in post-purchase confirmation and reminder emails.

## Hosting (Cloudflare)

Cloudflare builds the site from the `main` branch on every push.

- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy` (Workers). On Cloudflare Pages, leave it out and set the output directory to `dist`.
- **Node version:** 22, from `.node-version`.
- **At launch:** add the build variable `SITE_LIVE` = `true` so search engines can index the site.

## Develop

```sh
npm install
npm run dev     # http://localhost:4321
npm run build
```
