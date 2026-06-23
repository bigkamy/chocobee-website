import { z } from "zod";
import type { AdminResourceKey } from "./resources";

const status = z.enum(["ACTIVE", "INACTIVE"]).optional();

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().nullable(),
  subcategoryCtas: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        href: z.string().min(1),
        displayOrder: z.coerce.number().int().default(0),
        status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
      }),
    )
    .optional()
    .default([]),
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
  subcategoryCtaIds: z.array(z.string()).optional().default([]),
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

const aboutSectionItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  href: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const aboutPageSectionSchema = z.object({
  sectionKey: z.string().min(2),
  sectionType: z.enum(["story", "chef", "team", "features", "cta", "content"]).default("content"),
  label: z.string().min(2),
  eyebrow: z.string().optional().nullable(),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
  secondaryCtaLabel: z.string().optional().nullable(),
  secondaryCtaHref: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  status,
  items: z.array(aboutSectionItemSchema).default([]),
});

const contactSectionItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  href: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const contactPageSectionSchema = z.object({
  sectionKey: z.string().min(2),
  sectionType: z.enum(["hero", "details", "map", "form", "content"]).default("content"),
  label: z.string().min(2),
  eyebrow: z.string().optional().nullable(),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  imageAlt: z.string().optional().nullable(),
  mapEmbedUrl: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  status,
  items: z.array(contactSectionItemSchema).default([]),
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

const customOrderOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const customOrderSettingsSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  iconLabel: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  userSectionTitle: z.string().min(1),
  userName: z.string().min(1),
  userPhone: z.string().min(1),
  userEmail: z.string().email(),
  switchAccountLabel: z.string().min(1),
  switchAccountHref: z.string().min(1),
  cakeSectionTitle: z.string().min(1),
  themePlaceholder: z.string().min(1),
  cakeTextMaxLength: z.coerce.number().int().min(1).max(120),
  cakeTextPlaceholder: z.string().min(1),
  agePlaceholder: z.string().min(1),
  addressPlaceholder: z.string().min(1),
  notesPlaceholder: z.string().min(1),
  referenceSectionTitle: z.string().min(1),
  dropzoneTitle: z.string().min(1),
  dropzoneSubtitle: z.string().min(1),
  galleryToggleLabel: z.string().min(1),
  galleryLimit: z.coerce.number().int().min(1).max(48),
  maxUploadImages: z.coerce.number().int().min(1).max(12),
  maxUploadSizeMb: z.coerce.number().int().min(1).max(25),
  submitLabel: z.string().min(1),
  submittingLabel: z.string().min(1),
  footerNote: z.string().min(1),
  successMessage: z.string().min(1),
  autoCloseMs: z.coerce.number().int().min(1000).max(15000),
  businessWhatsappNumber: z.string().min(8),
  businessEmail: z.string().email(),
  enableGalleryPicker: z.coerce.boolean().default(true),
  enableReferenceUpload: z.coerce.boolean().default(true),
  options: z.object({
    occasion: z.array(customOrderOptionSchema).default([]),
    size: z.array(customOrderOptionSchema).default([]),
    tier: z.array(customOrderOptionSchema).default([]),
    flavour: z.array(customOrderOptionSchema).default([]),
    time: z.array(customOrderOptionSchema).default([]),
  }),
});

export const resourceSchemas = {
  categories: categorySchema,
  gallery: gallerySchema,
  about: aboutSchema,
  team: teamSchema,
  contact: contactSchema,
  settings: settingSchema,
} satisfies Record<AdminResourceKey, z.ZodObject<z.ZodRawShape>>;
