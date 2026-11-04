import { defineField, defineType } from 'sanity';

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (rule) => rule.required().max(60),
      initialValue: '3D Blog',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(160),
      initialValue: 'Explore the world of 3D web development with Three.js, WebGL, and creative coding tutorials.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label', validation: (rule) => rule.required() },
            { name: 'href', type: 'string', title: 'Href', validation: (rule) => rule.required().uri({ relativeOnly: true }) },
          ],
        },
      ],
      validation: (rule) => rule.max(6),
      initialValue: [
        { label: 'Blog', href: '/blog' },
        { label: 'Categories', href: '/categories' },
        { label: 'About', href: '/about' },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Platform', options: { list: ['twitter', 'github', 'linkedin', 'youtube', 'discord'] } },
            { name: 'url', type: 'url', title: 'URL', validation: (rule) => rule.uri({ scheme: ['http', 'https'] }) },
          ],
        },
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
      rows: 3,
      initialValue: 'Exploring the intersection of 3D graphics and web development.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});