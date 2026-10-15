// Switches for the parts of the site that sell things. Set either to true to bring it back:
// its nav link, page, homepage cards, and every mention elsewhere return together.
// While a switch is off, its pages redirect to the homepage (see astro.config.mjs).
export const features = {
  classes: false,
  bake: false,
};

/** Pages that are hidden while their switch is off. */
export const hiddenPaths = [
  ...(features.classes ? [] : ['/classes']),
  ...(features.bake ? [] : ['/bake']),
  ...(features.classes || features.bake ? [] : ['/policies']),
];
