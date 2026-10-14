# Korinne's Kitchen

The website for Korinne, a chef in Flower Mound, Texas: Kitchen Notes (blog), signature dishes, recipes, in-person classes, and weekly pickup bake drops.

- **Site:** [Astro](https://astro.build), hosted on Netlify.
- **Editing:** [Pages CMS](https://pagescms.org) (configured in `.pages.yml`). Content lives in `src/content/`.
- **Payments:** Stripe Checkout (not wired up yet).

## Privacy rule

Never put the home address in this repository or on the site. Only the area ("Flower Mound, Texas") is public. The address and parking notes are stored as a server secret and appear only in post-purchase confirmation and reminder emails.

## Develop

```sh
npm install
npm run dev     # http://localhost:4321
npm run build
```
