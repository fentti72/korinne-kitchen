# Korinne's Kitchen

The website for Korinne, a chef in Flower Mound, Texas: Kitchen Notes (blog), signature dishes, recipes, in-person classes, and weekly pickup bake drops.

- **Site:** [Astro](https://astro.build), hosted on Netlify.
- **Editing:** [Pages CMS](https://pagescms.org) (configured in `.pages.yml`). Content lives in `src/content/`.
- **Payments:** Stripe Checkout (not wired up yet).

## Pages

| Page | Path | Content lives in |
|---|---|---|
| Home | `/` | pulls from classes, bake drops, posts, gallery |
| Kitchen Notes | `/kitchen-notes/` (+ tag pages) | `src/content/posts` |
| Signature dishes | `/gallery/` | `src/content/gallery` |
| Recipes | `/recipes/` | `src/content/recipes` |
| Take a Class | `/classes/` | `src/content/classes` |
| What I'm Baking | `/bake/` | `src/content/bakes` |
| About | `/about/` | `src/pages/about.astro` |
| Policies | `/policies/` | `src/data/policies.yaml` |

Photos are in `src/assets/photos`; `scripts/crop-photos.py` records how each was cropped.
Run `npm run check:contrast` after changing any color in `src/styles/tokens.css`.

## Privacy rule

Never put the home address in this repository or on the site. Only the area ("Flower Mound, Texas") is public. The address and parking notes are stored as a server secret and appear only in post-purchase confirmation and reminder emails.

## Develop

```sh
npm install
npm run dev     # http://localhost:4321
npm run build
```
