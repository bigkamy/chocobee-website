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
  homeGroups: z.array(z.enum(["Recent Designs", "Most Viewed", "Top on Demand"])).optional().default([]),
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

export const homePageSectionSchema = z.object({
  sectionKey: z.string().min(2),
  label: z.string().min(2),
  title: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
  secondaryCtaLabel: z.string().optional().nullable(),
  secondaryCtaHref: z.string().optional().nullable(),
  categoryCards: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(2),
        description: z.string().optional().nullable(),
        imageUrl: z.string().min(2),
        imageAlt: z.string().min(2),
        ctaLabel: z.string().optional().nullable(),
        ctaHref: z.string().optional().nullable(),
        displayOrder: z.coerce.number().int().default(0),
        status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
      }),
    )
    .optional()
    .default([]),
  whyCards: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(2),
        text: z.string().min(2),
        displayOrder: z.coerce.number().int().default(0),
        status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
      }),
    )
    .optional()
    .default([]),
  displayOrder: z.coerce.number().int().default(0),
  status,
});

const footerLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().min(1),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const footerSettingsSchema = z.object({
  logoUrl: z.string(),
  logoAlt: z.string(),
  addressLines: z.array(z.string().min(1)).default([]),
  phoneLabel: z.string(),
  phoneHref: z.string(),
  emailLabel: z.string(),
  emailHref: z.string(),
  hoursLabel: z.string(),
  quickLinks: z.array(footerLinkSchema).default([]),
  categoryLinks: z.array(footerLinkSchema).default([]),
  socialLinks: z
    .array(
      footerLinkSchema.extend({
        type: z.enum(["instagram", "facebook", "whatsapp", "google"]),
      }),
    )
    .default([]),
  formTitle: z.string().min(1),
  formNameLabel: z.string().min(1),
  formPhoneLabel: z.string().min(1),
  formMessageLabel: z.string().min(1),
  formSubmitLabel: z.string().min(1),
  formSuccessMessage: z.string().min(1),
  formErrorMessage: z.string().min(1),
  copyrightText: z.string().min(1),
  creditText: z.string().min(1),
});

export const resourceSchemas = {
  categories: categorySchema,
  gallery: gallerySchema,
  about: aboutSchema,
  team: teamSchema,
  contact: contactSchema,
  settings: settingSchema,
} satisfies Record<AdminResourceKey, z.ZodObject<z.ZodRawShape>>;
