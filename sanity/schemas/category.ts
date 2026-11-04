import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(30),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Shown on category page',
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Hex color for UI accents (e.g., #8b5cf6)',
      validation: (rule) => rule.regex(/^#[0-9A-Fa-f]{6}$/, { name: 'hex color', invert: false }),
      initialValue: '#8b5cf6',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Emoji or short text for display (e.g., 🎨, </>, 🌈)',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
});