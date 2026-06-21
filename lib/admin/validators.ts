import { z } from "zod";
import type { AdminResourceKey } from "./resources";

const status = z.enum(["ACTIVE", "INACTIVE"]).optional();

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  status,
});

export const gallerySchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  imageUrl: z.string().min(2),
  publicId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  categoryIds: z.array(z.string()).optional().default([]),
  tags: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  altText: z.string().min(2),
  keywords: z.string().optional().nullable(),
  featured: z.coerce.boolean().default(false),
  status,
});

export const aboutSchema = z.object({
  aboutText: z.string().min(20),
  chefName: z.string().min(2),
  chefDescription: z.string().min(20),
  chefImageUrl: z.string().optional().nullable(),
});

export const teamSchema = z.object({
  name: z.string().min(2),
  designation: z.string().min(2),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  status,
});

export const contactSchema = z.object({
  phone: z.string().min(8),
  email: z.string().email(),
  address: z.string().min(5),
  whatsappNumber: z.string().min(8),
});

export const settingSchema = z.object({
  logoUrl: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  whatsappUrl: z.string().optional().nullable(),
  googleUrl: z.string().optional().nullable(),
});

export const resourceSchemas = {
  categories: categorySchema,
  gallery: gallerySchema,
  about: aboutSchema,
  team: teamSchema,
  contact: contactSchema,
  settings: settingSchema,
} satisfies Record<AdminResourceKey, z.ZodObject<z.ZodRawShape>>;
