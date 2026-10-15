// Recipe categories, in menu order. The slug is used in the address (/recipes/category/<slug>/)
// and in each recipe's `category` field; the label is what visitors see.
export const recipeCategories = [
  { slug: 'breads', label: 'Breads' },
  { slug: 'desserts', label: 'Desserts' },
  { slug: 'cookies', label: 'Cookies' },
  { slug: 'main-dishes', label: 'Main Dishes' },
  { slug: 'side-dishes', label: 'Side Dishes' },
] as const;

export type RecipeCategory = (typeof recipeCategories)[number]['slug'];

export const categoryLabel = (slug: RecipeCategory) => recipeCategories.find((c) => c.slug === slug)!.label;
export const categoryHref = (slug: RecipeCategory) => `/recipes/category/${slug}/`;
