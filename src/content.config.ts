import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const level = z.enum(['Beginner', 'Intermediate', 'Advanced', 'All levels']);

// Kitchen Notes: short, photo-led posts.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      photo: image().optional(),
      photoAlt: z.string().default(''),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

// In-person classes. `seats` is the total; `seatsLeft` is set by hand until the
// booking system reports it live.
const classes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/classes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      start: z.coerce.date(),
      durationMinutes: z.number().int().positive(),
      level,
      seats: z.number().int().positive(),
      seatsLeft: z.number().int().nonnegative().optional(),
      price: z.number().nonnegative(),
      youllMake: z.array(z.string()).default([]),
      takeHome: z.string().default(''),
      bring: z.string().default(''),
      minAge: z.number().int().optional(),
      photo: image().optional(),
      photoAlt: z.string().default(''),
      draft: z.boolean().default(false),
    }),
});

// Weekly bake drops.
const bakes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bakes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      ordersOpen: z.coerce.date(),
      ordersClose: z.coerce.date(),
      pickupWindows: z.array(z.string()).min(1),
      items: z
        .array(
          z.object({
            name: z.string(),
            description: z.string().default(''),
            price: z.number().nonnegative(),
            quantity: z.number().int().positive(),
            // Set by hand until the order system reports it live.
            left: z.number().int().nonnegative().optional(),
            perOrderLimit: z.number().int().positive().default(2),
            photo: image().optional(),
            photoAlt: z.string().default(''),
          }),
        )
        .min(1),
      photo: image().optional(),
      photoAlt: z.string().default(''),
      draft: z.boolean().default(false),
    }),
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().default(''),
      servings: z.number().int().positive(),
      prepMinutes: z.number().int().nonnegative(),
      cookMinutes: z.number().int().nonnegative(),
      // Amount is numeric so it can scale with servings; leave it empty for "to taste".
      ingredients: z.array(
        z.object({
          amount: z.number().positive().optional(),
          unit: z.string().default(''),
          item: z.string(),
        }),
      ),
      steps: z.array(z.string()).min(1),
      tags: z.array(z.string()).default([]),
      photo: image().optional(),
      photoAlt: z.string().default(''),
      draft: z.boolean().default(false),
    }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      photo: image(),
      photoAlt: z.string(),
      order: z.number().default(0),
    }),
});

const policies = defineCollection({
  loader: file('src/data/policies.yaml'),
  schema: z.object({
    title: z.string(),
    group: z.enum(['classes', 'bake']),
    order: z.number().default(0),
    body: z.string(),
  }),
});

export const collections = { posts, classes, bakes, recipes, gallery, policies };
