// Site-wide settings. Never put the home address here (or anywhere in this repo):
// it only goes in post-purchase emails, stored as a server secret.
export const site = {
  name: "Korinne's Kitchen",
  chef: 'Korinne',
  tagline: 'Home cooking, baking, and hands-on classes in Flower Mound, Texas.',
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
    { href: '/classes/', label: 'Classes' },
    { href: '/bake/', label: "What I'm Baking" },
    { href: '/recipes/', label: 'Recipes' },
    { href: '/gallery/', label: 'Gallery' },
    { href: '/about/', label: 'About' },
  ],
} as const;
