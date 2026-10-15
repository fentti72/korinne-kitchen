import { features } from './features';
import { recipeCategories, categoryHref } from './recipe-categories';

// Site-wide settings. Never put the home address here (or anywhere in this repo):
// it only goes in post-purchase emails, stored as a server secret.
export const site = {
  features,
  name: "Korinne's Kitchen",
  chef: 'Korinne',
  tagline: features.classes
    ? 'Home cooking, baking, and hands-on classes in Flower Mound, Texas.'
    : 'Home cooking and baking from a chef in Flower Mound, Texas.',
  area: {
    city: 'Flower Mound',
    region: 'TX',
    country: 'US',
    // Shown publicly instead of an address.
    label: 'Flower Mound, Texas',
  },
  // Filled in once the newsletter service is chosen (Buttondown or Kit).
  newsletterAction: '',
  instagram: '',
  nav: [
    { href: '/kitchen-notes/', label: 'Kitchen Notes' },
    ...(features.classes ? [{ href: '/classes/', label: 'Classes' }] : []),
    ...(features.bake ? [{ href: '/bake/', label: "What I'm Baking" }] : []),
    {
      href: '/recipes/',
      label: 'Recipes',
      children: recipeCategories.map((c) => ({ href: categoryHref(c.slug), label: c.label })),
    },
    { href: '/gallery/', label: 'Gallery' },
    { href: '/about/', label: 'About' },
  ],
} as const;
