import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CmsStatus = "ACTIVE" | "INACTIVE";

export type CmsSubcategoryCta = {
  id: string;
  label: string;
  href: string;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  subcategoryCtas?: CmsSubcategoryCta[];
  displayOrder: number;
  status: CmsStatus;
};

export type CmsReview = {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsGalleryImage = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl: string;
  publicId?: string | null;
  categoryId?: string | null;
  categorySlug?: string | null;
  categoryIds?: string[];
  categorySlugs?: string[];
  subcategoryCtaIds?: string[];
  homeGroups?: string[];
  tags?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  altText: string;
  keywords?: string | null;
  featured: boolean;
  status: CmsStatus;
  createdAt: string;
};

export type CmsHomePageSection = {
  id: string;
  sectionKey: string;
  label: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  displayOrder: number;
  status: CmsStatus;
  updatedAt: string;
  categoryCards?: CmsHomeCategoryCard[];
  whyCards?: CmsHomeWhyCard[];
};

export type CmsHomeCategoryCard = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  imageAlt: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsHomeWhyCard = {
  id: string;
  title: string;
  text: string;
  iconUrl?: string | null;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsFooterLink = {
  id: string;
  label: string;
  href: string;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsFooterSocialLink = CmsFooterLink & {
  type: "instagram" | "facebook" | "whatsapp" | "google";
};

export type CmsFooterSettings = {
  id: string;
  logoUrl: string;
  logoAlt: string;
  addressLines: string[];
  phoneLabel: string;
  phoneHref: string;
  emailLabel: string;
  emailHref: string;
  hoursLabel: string;
  quickLinks: CmsFooterLink[];
  categoryLinks: CmsFooterLink[];
  socialLinks: CmsFooterSocialLink[];
  formTitle: string;
  formNameLabel: string;
  formPhoneLabel: string;
  formMessageLabel: string;
  formSubmitLabel: string;
  formSuccessMessage: string;
  formErrorMessage: string;
  copyrightText: string;
  creditText: string;
  updatedAt: string;
};

export type CmsAboutSectionType = "story" | "chef" | "team" | "features" | "cta" | "content";

export type CmsAboutSectionItem = {
  id: string;
  label: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  href?: string | null;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsAboutPageSection = {
  id: string;
  sectionKey: string;
  sectionType: CmsAboutSectionType;
  label: string;
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaHref?: string | null;
  displayOrder: number;
  status: CmsStatus;
  updatedAt: string;
  items: CmsAboutSectionItem[];
};

export type CmsContactSectionType = "hero" | "details" | "map" | "form" | "content";

export type CmsContactSectionItem = {
  id: string;
  label: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  href?: string | null;
  icon?: string | null;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsContactPageSection = {
  id: string;
  sectionKey: string;
  sectionType: CmsContactSectionType;
  label: string;
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  mapEmbedUrl?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  displayOrder: number;
  status: CmsStatus;
  updatedAt: string;
  items: CmsContactSectionItem[];
};

export type CmsCustomOrderOptionGroup = "occasion" | "size" | "tier" | "flavour" | "time";

export type CmsCustomOrderOption = {
  id: string;
  label: string;
  value: string;
  displayOrder: number;
  status: CmsStatus;
};

export type CmsCustomOrderSettings = {
  id: string;
  status: CmsStatus;
  iconLabel: string;
  title: string;
  subtitle: string;
  userSectionTitle: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  switchAccountLabel: string;
  switchAccountHref: string;
  cakeSectionTitle: string;
  themePlaceholder: string;
  cakeTextMaxLength: number;
  cakeTextPlaceholder: string;
  agePlaceholder: string;
  addressPlaceholder: string;
  notesPlaceholder: string;
  referenceSectionTitle: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  galleryToggleLabel: string;
  galleryLimit: number;
  maxUploadImages: number;
  maxUploadSizeMb: number;
  submitLabel: string;
  submittingLabel: string;
  footerNote: string;
  successMessage: string;
  autoCloseMs: number;
  businessWhatsappNumber: string;
  businessEmail: string;
  enableGalleryPicker: boolean;
  enableReferenceUpload: boolean;
  options: Record<CmsCustomOrderOptionGroup, CmsCustomOrderOption[]>;
  updatedAt: string;
};

type CmsData = {
  categories: CmsCategory[];
  reviews: CmsReview[];
  galleryImages: CmsGalleryImage[];
  homePageSections: CmsHomePageSection[];
  aboutPageSections: CmsAboutPageSection[];
  contactPageSections: CmsContactPageSection[];
  footerSettings: CmsFooterSettings;
  customOrderSettings: CmsCustomOrderSettings;
};

// Bundled defaults shipped with the build; only used to seed Postgres on first
// boot. Live content is read from and written to the CmsDocument row below.
const cmsPath = path.join(process.cwd(), "data", "cms.json");
const CMS_DOC_KEY = "cms";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const defaultCategories: CmsCategory[] = [
  {
    id: "birthday-cakes",
    name: "Birthday Cakes",
    slug: "birthday-cakes",
    description: "Custom birthday cakes for joyful celebrations.",
    displayOrder: 1,
    status: "ACTIVE",
  },
  {
    id: "wedding-cakes",
    name: "Wedding Cakes",
    slug: "wedding-cakes",
    description: "Elegant wedding cakes with premium finishes.",
    displayOrder: 2,
    status: "ACTIVE",
  },
  {
    id: "designer-cakes",
    name: "Designer Cakes",
    slug: "designer-cakes",
    description: "Creative designer cakes for special themes.",
    displayOrder: 3,
    status: "ACTIVE",
  },
  {
    id: "kids-cakes",
    name: "Kids Cakes",
    slug: "kids-cakes",
    description: "Fun kids cakes with colorful theme designs.",
    displayOrder: 4,
    status: "ACTIVE",
  },
  {
    id: "cookies",
    name: "Cookies",
    slug: "cookies",
    description: "Handcrafted cookies for gifting and dessert tables.",
    displayOrder: 5,
    status: "ACTIVE",
  },
];

export const defaultGalleryImages: CmsGalleryImage[] = [
  {
    id: "chocolate-truffle-cake",
    title: "Chocolate Truffle Cake",
    slug: "chocolate-truffle-cake",
    description: "Rich chocolate truffle cake finished for birthdays and premium celebrations.",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    categoryId: "birthday-cakes",
    categorySlug: "birthday-cakes",
    categoryIds: ["birthday-cakes"],
    categorySlugs: ["birthday-cakes"],
    homeGroups: ["Recent Designs", "Top on Demand"],
    tags: "chocolate, birthday, truffle",
    seoTitle: "Chocolate Truffle Cake | Chocobee Cake Studio",
    metaDescription: "Explore a premium chocolate truffle cake design by Chocobee Cake Studio.",
    altText: "Chocolate truffle birthday cake by Chocobee Cake Studio",
    keywords: "chocolate cake, truffle cake, birthday cake",
    featured: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "royal-wedding-lace-cake",
    title: "Royal Wedding Lace Cake",
    slug: "royal-wedding-lace-cake",
    description: "Elegant wedding cake with soft lace-inspired detailing.",
    imageUrl: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85",
    categoryId: "wedding-cakes",
    categorySlug: "wedding-cakes",
    categoryIds: ["wedding-cakes"],
    categorySlugs: ["wedding-cakes"],
    homeGroups: ["Most Viewed", "Top on Demand"],
    tags: "wedding, lace, elegant",
    seoTitle: "Royal Wedding Lace Cake | Chocobee Cake Studio",
    metaDescription: "View a premium lace-style wedding cake design from Chocobee Cake Studio.",
    altText: "Royal wedding lace cake design",
    keywords: "wedding cake, lace cake, designer wedding cake",
    featured: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "kids-candy-theme-cake",
    title: "Kids Candy Theme Cake",
    slug: "kids-candy-theme-cake",
    description: "A colorful candy theme cake made for kids parties.",
    imageUrl: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=85",
    categoryId: "kids-cakes",
    categorySlug: "kids-cakes",
    categoryIds: ["kids-cakes"],
    categorySlugs: ["kids-cakes"],
    homeGroups: ["Recent Designs"],
    tags: "kids, candy, birthday",
    seoTitle: "Kids Candy Theme Cake | Chocobee Cake Studio",
    metaDescription: "Discover a colorful kids candy theme cake by Chocobee Cake Studio.",
    altText: "Kids candy theme cake",
    keywords: "kids cake, theme cake, candy cake",
    featured: false,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
  },
];

export const defaultHomeCategoryCards: CmsHomeCategoryCard[] = [
  {
    id: "birthday-cakes",
    title: "Birthday Cakes",
    description: "Joyful custom layers with playful colors, toppers, and flavors made for every age.",
    imageUrl: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Colorful birthday cake with candles",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 1,
    status: "ACTIVE",
  },
  {
    id: "wedding-cakes",
    title: "Wedding Cakes",
    description: "Elegant tiered cakes with refined finishes, florals, and premium celebration flavors.",
    imageUrl: "https://images.unsplash.com/photo-1525257831700-183b9b8bf5cd?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Elegant white wedding cake with flowers",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 2,
    status: "ACTIVE",
  },
  {
    id: "theme-cakes",
    title: "Theme Cakes",
    description: "Character, hobby, and event-inspired cakes shaped around your favorite story.",
    imageUrl: "https://images.unsplash.com/photo-1604413191066-4dd20bedf486?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Decorated theme cake with colorful frosting",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 3,
    status: "ACTIVE",
  },
  {
    id: "cupcakes",
    title: "Cupcakes",
    description: "Soft, gift-ready cupcake boxes with swirls, sprinkles, fillings, and cute toppers.",
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Pink frosted cupcakes in a bakery display",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 4,
    status: "ACTIVE",
  },
  {
    id: "anniversary-cakes",
    title: "Anniversary Cakes",
    description: "Romantic buttercream cakes with gentle colors, golden details, and personal messages.",
    imageUrl: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Pink celebration cake with buttercream details",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 5,
    status: "ACTIVE",
  },
  {
    id: "cookies-brownies",
    title: "Cookies & Brownies",
    description: "Giftable cookie boxes, fudgy brownies, and bite-sized treats for dessert tables.",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Fresh baked cookies on a cooling rack",
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    displayOrder: 6,
    status: "ACTIVE",
  },
];

export const defaultHomeWhyCards: CmsHomeWhyCard[] = [
  {
    id: "baked-fresh",
    title: "Baked Fresh",
    text: "Small-batch cakes, cupcakes, and fillings made with premium ingredients.",
    displayOrder: 1,
    status: "ACTIVE",
  },
  {
    id: "custom-magic",
    title: "Custom Magic",
    text: "Colors, toppers, flavors, and themes designed around your celebration.",
    displayOrder: 2,
    status: "ACTIVE",
  },
  {
    id: "party-ready",
    title: "Party Ready",
    text: "Neat packaging, careful timing, and desserts that photograph beautifully.",
    displayOrder: 3,
    status: "ACTIVE",
  },
];

export const defaultHomePageSections: CmsHomePageSection[] = [
  {
    id: "hero",
    sectionKey: "hero",
    label: "Hero",
    title: "Meet the Chef Neha Panwar",
    subtitle: "Serving since 2013",
    content:
      "From a humble home kitchen to a name everyone celebrates—turning cakes into unforgettable experiences. ",
    imageUrl: "https://chocobee-uploads-556311299862.s3.ap-south-1.amazonaws.com/content/neha.png",
    imageAlt: "Chef Neha Panwar",
    ctaLabel: "Know More",
    ctaHref: "/about#chef",
    secondaryCtaLabel: "Explore our Treat",
    secondaryCtaHref: "/gallery",
    displayOrder: 1,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "why-us",
    sectionKey: "why-us",
    label: "Why Us",
    title: "Baked Fresh, Custom Magic, Party Ready",
    subtitle: "Trust highlights",
    content: "Manage the home page trust cards and short selling points section.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    displayOrder: 2,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    whyCards: defaultHomeWhyCards,
  },
  {
    id: "categories",
    sectionKey: "categories",
    label: "Our Categories",
    title: "Our Categories",
    subtitle: "Made for every celebration",
    content: "Control the category slider section title, copy, imagery, ordering, and visibility.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: "Explore More",
    ctaHref: "#contact",
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    categoryCards: defaultHomeCategoryCards,
    displayOrder: 3,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gallery",
    sectionKey: "gallery",
    label: "Cake Gallery",
    title: "Cake Gallery",
    subtitle: "From Our Studio",
    content: "Manage the home page gallery intro and call-to-action content.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: "Visit Gallery",
    ctaHref: "/gallery",
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    displayOrder: 4,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
  },
];

export const defaultAboutPageSections: CmsAboutPageSection[] = [
  {
    id: "story",
    sectionKey: "story",
    sectionType: "story",
    label: "Our Story",
    eyebrow: "Our Story",
    title: "Designed with care, baked with purpose.",
    subtitle: "",
    content:
      "Chocobee Cake Studio has been serving sweet happiness since 2013, creating 25,000+ unique cake designs for 5,000+ happy clients. We specialize in custom cakes, theme cakes, designer celebration cakes, cupcakes, and dessert moments that feel deeply personal. Every order is treated as a story: your theme, your colors, your flavor memories, and the joy you want your guests to feel.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    displayOrder: 1,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: "designer-celebration-cakes",
        label: "Slider Image",
        title: "Designer Celebration Cakes",
        imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
        imageAlt: "Designer Celebration Cakes",
        displayOrder: 1,
        status: "ACTIVE",
      },
      {
        id: "wedding-cake-finishes",
        label: "Slider Image",
        title: "Wedding Cake Finishes",
        imageUrl: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85",
        imageAlt: "Wedding Cake Finishes",
        displayOrder: 2,
        status: "ACTIVE",
      },
      {
        id: "pastel-party-cakes",
        label: "Slider Image",
        title: "Pastel Party Cakes",
        imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=85",
        imageAlt: "Pastel Party Cakes",
        displayOrder: 3,
        status: "ACTIVE",
      },
      {
        id: "cupcake-gift-boxes",
        label: "Slider Image",
        title: "Cupcake Gift Boxes",
        imageUrl: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=900&q=85",
        imageAlt: "Cupcake Gift Boxes",
        displayOrder: 4,
        status: "ACTIVE",
      },
      {
        id: "chocolate-signature-cakes",
        label: "Slider Image",
        title: "Chocolate Signature Cakes",
        imageUrl: "https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=85",
        imageAlt: "Chocolate Signature Cakes",
        displayOrder: 5,
        status: "ACTIVE",
      },
      {
        id: "handcrafted-cookies",
        label: "Slider Image",
        title: "Handcrafted Cookies",
        imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",
        imageAlt: "Handcrafted Cookies",
        displayOrder: 6,
        status: "ACTIVE",
      },
    ],
  },
  {
    id: "chef",
    sectionKey: "chef",
    sectionType: "chef",
    label: "Meet the Chef",
    eyebrow: "Meet the Chef",
    title: "Neha Panwar",
    subtitle: "",
    content:
      "Chef Neha Panwar leads Chocobee Cake Studio with a passion for creative storytelling through cake. Her journey is rooted in listening carefully to each client, translating ideas into elegant edible designs, and delivering cakes that taste as beautiful as they look. Her expertise in theme detailing, premium finishes, and customer-first service has helped make thousands of celebrations truly unforgettable.",
    imageUrl: "https://chocobee-uploads-556311299862.s3.ap-south-1.amazonaws.com/content/neha.png",
    imageAlt: "Chef Neha Panwar",
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    displayOrder: 2,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [
      { id: "years", label: "Stat", title: "11+", subtitle: "Years of Experience", displayOrder: 1, status: "ACTIVE" },
      { id: "designs", label: "Stat", title: "25,000+", subtitle: "Unique Designs", displayOrder: 2, status: "ACTIVE" },
      { id: "clients", label: "Stat", title: "5,000+", subtitle: "Happy Clients", displayOrder: 3, status: "ACTIVE" },
    ],
  },
  {
    id: "team",
    sectionKey: "team",
    sectionType: "team",
    label: "Our Team",
    eyebrow: "Our Team",
    title: "Artists behind every celebration",
    subtitle: "",
    content:
      "Our team brings together cake artists, designers, support specialists, and delivery coordinators who work with care, discipline, and a shared love for beautiful celebrations.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    displayOrder: 3,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [
      {
        id: "aarohi-sharma",
        label: "Team Member",
        title: "Aarohi Sharma",
        subtitle: "Cake Artist",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85",
        imageAlt: "Aarohi Sharma",
        displayOrder: 1,
        status: "ACTIVE",
      },
      {
        id: "riya-kapoor",
        label: "Team Member",
        title: "Riya Kapoor",
        subtitle: "Theme Designer",
        imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85",
        imageAlt: "Riya Kapoor",
        displayOrder: 2,
        status: "ACTIVE",
      },
      {
        id: "kunal-mehra",
        label: "Team Member",
        title: "Kunal Mehra",
        subtitle: "Customer Support",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85",
        imageAlt: "Kunal Mehra",
        displayOrder: 3,
        status: "ACTIVE",
      },
      {
        id: "nisha-verma",
        label: "Team Member",
        title: "Nisha Verma",
        subtitle: "Delivery Coordinator",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
        imageAlt: "Nisha Verma",
        displayOrder: 4,
        status: "ACTIVE",
      },
    ],
  },
  {
    id: "features",
    sectionKey: "features",
    sectionType: "features",
    label: "Why Choose Us",
    eyebrow: "Why Choose Us",
    title: "Premium cakes, polished experience",
    subtitle: "",
    content: "",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: null,
    ctaHref: null,
    secondaryCtaLabel: null,
    secondaryCtaHref: null,
    displayOrder: 4,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: ["Custom Designs", "Premium Ingredients", "Timely Delivery", "Customer Satisfaction", "Creative Concepts", "Hygiene & Quality"].map((title, index) => ({
      id: slugify(title),
      label: "Feature",
      title,
      displayOrder: index + 1,
      status: "ACTIVE" as const,
    })),
  },
  {
    id: "cta",
    sectionKey: "cta",
    sectionType: "cta",
    label: "Final CTA",
    eyebrow: "",
    title: "Let's Create Something Sweet Together",
    subtitle: "",
    content: "Tell us your theme, flavor, date, and celebration mood. We will help shape it into a cake worth remembering.",
    imageUrl: null,
    imageAlt: null,
    ctaLabel: "Order Your Cake Now",
    ctaHref: "/gallery",
    secondaryCtaLabel: "WhatsApp Us",
    secondaryCtaHref: "https://wa.me/919999757191",
    displayOrder: 5,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [],
  },
];

export const defaultContactPageSections: CmsContactPageSection[] = [
  {
    id: "hero",
    sectionKey: "hero",
    sectionType: "hero",
    label: "Hero",
    eyebrow: "Contact Chocobee",
    title: "Get in Touch",
    subtitle: "",
    content:
      "Planning a birthday, wedding, shower, or custom dessert table? Share your celebration details and our studio will help shape the perfect cake experience.",
    imageUrl: null,
    imageAlt: null,
    mapEmbedUrl: null,
    ctaLabel: null,
    ctaHref: null,
    displayOrder: 1,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [],
  },
  {
    id: "details",
    sectionKey: "details",
    sectionType: "details",
    label: "Contact Details",
    eyebrow: "",
    title: "Contact Details",
    subtitle: "",
    content: "",
    imageUrl: null,
    imageAlt: null,
    mapEmbedUrl: null,
    ctaLabel: "Chat on WhatsApp",
    ctaHref: "https://wa.me/",
    displayOrder: 2,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [
      { id: "studio", label: "Studio", title: "Studio", subtitle: "Chocobee Cake Studio", icon: "studio", displayOrder: 1, status: "ACTIVE" },
      { id: "address", label: "Address", title: "Address", subtitle: "Crossing Republik, Ghaziabad", icon: "address", displayOrder: 2, status: "ACTIVE" },
      { id: "phone", label: "Phone", title: "Phone", subtitle: "+91 00000 00000", href: "tel:+910000000000", icon: "phone", displayOrder: 3, status: "ACTIVE" },
      { id: "email", label: "Email", title: "Email", subtitle: "hello@chocobeecake.studio", href: "mailto:hello@chocobeecake.studio", icon: "email", displayOrder: 4, status: "ACTIVE" },
      { id: "hours", label: "Working Hours", title: "Working Hours", subtitle: "10 AM - 10 PM", icon: "hours", displayOrder: 5, status: "ACTIVE" },
    ],
  },
  {
    id: "map",
    sectionKey: "map",
    sectionType: "map",
    label: "Map",
    eyebrow: "",
    title: "Studio Location",
    subtitle: "",
    content: "",
    imageUrl: null,
    imageAlt: null,
    mapEmbedUrl: "https://www.google.com/maps?q=Crossing%20Republik%2C%20Ghaziabad&output=embed",
    ctaLabel: null,
    ctaHref: null,
    displayOrder: 3,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [],
  },
  {
    id: "form",
    sectionKey: "form",
    sectionType: "form",
    label: "Contact Form",
    eyebrow: "",
    title: "Send a Message",
    subtitle: "",
    content: "Thank you. Our team will contact you shortly.",
    imageUrl: null,
    imageAlt: null,
    mapEmbedUrl: null,
    ctaLabel: "Submit Request",
    ctaHref: null,
    displayOrder: 4,
    status: "ACTIVE",
    updatedAt: new Date().toISOString(),
    items: [
      { id: "name", label: "Full Name", title: "Full Name", subtitle: "Your full name", icon: "text", displayOrder: 1, status: "ACTIVE" },
      { id: "email", label: "Email Address", title: "Email Address", subtitle: "you@example.com", icon: "email", displayOrder: 2, status: "ACTIVE" },
      { id: "phone", label: "Phone Number", title: "Phone Number", subtitle: "+91 00000 00000", icon: "phone", displayOrder: 3, status: "ACTIVE" },
      { id: "message", label: "Message", title: "Message", subtitle: "Tell us about your cake theme, date, flavor, and size.", icon: "textarea", displayOrder: 4, status: "ACTIVE" },
    ],
  },
];

export const defaultFooterSettings: CmsFooterSettings = {
  id: "footer",
  logoUrl: "https://chocobee-uploads-556311299862.s3.ap-south-1.amazonaws.com/content/CB_logo.png",
  logoAlt: "Chocobee Cake Studio",
  addressLines: ["Crossing Republik, Ghaziabad, Gaur City 1 & 2, Noida Extension"],
  phoneLabel: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  emailLabel: "hello@chocobeecake.studio",
  emailHref: "mailto:hello@chocobeecake.studio",
  hoursLabel: "10 AM - 10 PM",
  quickLinks: [
    { id: "home", label: "Home", href: "/", displayOrder: 1, status: "ACTIVE" },
    { id: "cakes-cookies", label: "Cakes & Cookies", href: "/gallery", displayOrder: 2, status: "ACTIVE" },
    { id: "custom-orders", label: "Custom Orders", href: "/contact", displayOrder: 3, status: "ACTIVE" },
    { id: "gallery", label: "Gallery", href: "/gallery", displayOrder: 4, status: "ACTIVE" },
    { id: "about-us", label: "About Us", href: "/about", displayOrder: 5, status: "ACTIVE" },
    { id: "contact-us", label: "Contact Us", href: "/contact", displayOrder: 6, status: "ACTIVE" },
    { id: "privacy-policy", label: "Privacy Policy", href: "/privacy-policy", displayOrder: 7, status: "ACTIVE" },
    { id: "terms", label: "Terms & Conditions", href: "/terms-and-conditions", displayOrder: 8, status: "ACTIVE" },
  ],
  categoryLinks: [
    { id: "wedding-cakes", label: "Wedding Cakes", href: "/gallery", displayOrder: 1, status: "ACTIVE" },
    { id: "theme-cakes", label: "Theme Cakes", href: "/gallery", displayOrder: 2, status: "ACTIVE" },
    { id: "birthday-cakes", label: "Birthday Cakes", href: "/gallery", displayOrder: 3, status: "ACTIVE" },
    { id: "anniversary-cakes", label: "Anniversary Cakes", href: "/gallery", displayOrder: 4, status: "ACTIVE" },
    { id: "cupcakes", label: "Cupcakes", href: "/gallery", displayOrder: 5, status: "ACTIVE" },
    { id: "kids-cakes", label: "Kids Cakes", href: "/gallery", displayOrder: 6, status: "ACTIVE" },
  ],
  socialLinks: [
    { id: "instagram", type: "instagram", label: "Instagram", href: "https://instagram.com", displayOrder: 1, status: "ACTIVE" },
    { id: "facebook", type: "facebook", label: "Facebook", href: "https://facebook.com", displayOrder: 2, status: "ACTIVE" },
    { id: "whatsapp", type: "whatsapp", label: "WhatsApp", href: "https://wa.me/", displayOrder: 3, status: "ACTIVE" },
    { id: "google", type: "google", label: "Google Reviews", href: "/#reviews-heading", displayOrder: 4, status: "ACTIVE" },
  ],
  formTitle: "Reach Us",
  formNameLabel: "Name",
  formPhoneLabel: "Phone",
  formMessageLabel: "Message",
  formSubmitLabel: "Submit",
  formSuccessMessage: "Thank you. We will reach out shortly.",
  formErrorMessage: "Please fill all required details correctly.",
  copyrightText: "© 2026 Chocobee Cake Studio. All Rights Reserved.",
  creditText: "Designed with love by Chocobee",
  updatedAt: new Date().toISOString(),
};

const defaultCustomOrderOptions: Record<CmsCustomOrderOptionGroup, CmsCustomOrderOption[]> = {
  occasion: ["Birthday", "Wedding", "Anniversary", "Baby Shower", "Corporate", "Other"].map((label, index) => ({
    id: slugify(label),
    label,
    value: label,
    displayOrder: index + 1,
    status: "ACTIVE",
  })),
  size: ["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg", "4 kg", "5+ kg"].map((label, index) => ({
    id: slugify(label),
    label,
    value: label,
    displayOrder: index + 1,
    status: "ACTIVE",
  })),
  tier: ["Single Tier", "2-Tier", "3-Tier", "Multi-Tier"].map((label, index) => ({
    id: slugify(label),
    label,
    value: label,
    displayOrder: index + 1,
    status: "ACTIVE",
  })),
  flavour: ["Chocolate", "Vanilla", "Strawberry", "Red Velvet", "Black Forest", "Butterscotch", "Pineapple", "Custom"].map((label, index) => ({
    id: slugify(label),
    label,
    value: label,
    displayOrder: index + 1,
    status: "ACTIVE",
  })),
  time: ["9 AM - 12 PM", "12 PM - 3 PM", "3 PM - 6 PM", "6 PM - 9 PM", "Specific Time"].map((label, index) => ({
    id: slugify(label),
    label,
    value: label,
    displayOrder: index + 1,
    status: "ACTIVE",
  })),
};

export const defaultCustomOrderSettings: CmsCustomOrderSettings = {
  id: "custom-order",
  status: "ACTIVE",
  iconLabel: "Cake",
  title: "Custom Cake Order",
  subtitle: "Fill details & we'll confirm via your preferred channel",
  userSectionTitle: "User Details",
  userName: "Guest Customer",
  userPhone: "+91 00000 00000",
  userEmail: "hello@chocobeecake.studio",
  switchAccountLabel: "Not you? Switch account",
  switchAccountHref: "/admin/login",
  cakeSectionTitle: "Cake Details",
  themePlaceholder: "e.g., Unicorn, Superhero, Floral, Minimalist",
  cakeTextMaxLength: 30,
  cakeTextPlaceholder: "Text on cake",
  agePlaceholder: "e.g., 25",
  addressPlaceholder: "Full address with landmark & pincode",
  notesPlaceholder: "Any special instructions, allergies, eggless requirement, etc.",
  referenceSectionTitle: "Reference Images",
  dropzoneTitle: "Drop cake photos here or click to browse",
  dropzoneSubtitle: "Max 5 images, 5MB each (JPG, PNG)",
  galleryToggleLabel: "Or select from our gallery",
  galleryLimit: 12,
  maxUploadImages: 5,
  maxUploadSizeMb: 5,
  submitLabel: "Submit",
  submittingLabel: "Submitting...",
  footerNote: "You'll receive confirmation within 30 minutes",
  successMessage: "Order submitted! We will confirm shortly.",
  autoCloseMs: 4000,
  businessWhatsappNumber: "910000000000",
  businessEmail: "hello@chocobeecake.studio",
  enableGalleryPicker: true,
  enableReferenceUpload: true,
  options: defaultCustomOrderOptions,
  updatedAt: new Date().toISOString(),
};

function normalizeFooterLinks(links: CmsFooterLink[] | undefined, fallback: CmsFooterLink[]) {
  return (links?.length ? links : fallback)
    .map((link, index) => ({
      ...link,
      id: link.id || slugify(link.label || `footer-link-${index + 1}`),
      label: link.label || `Footer Link ${index + 1}`,
      href: link.href || "#",
      displayOrder: link.displayOrder ?? index + 1,
      status: link.status ?? "ACTIVE",
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

function normalizeSubcategoryCtas(ctas: CmsSubcategoryCta[] | undefined) {
  return (ctas ?? [])
    .map((cta, index) => ({
      ...cta,
      id: cta.id || slugify(cta.label || `subcategory-cta-${index + 1}`),
      label: cta.label || `Subcategory ${index + 1}`,
      href: cta.href || "#",
      displayOrder: cta.displayOrder ?? index + 1,
      status: cta.status ?? "ACTIVE",
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

function normalizeFooterSocialLinks(links: CmsFooterSocialLink[] | undefined, fallback: CmsFooterSocialLink[]) {
  return (links?.length ? links : fallback)
    .map((link, index) => ({
      ...link,
      id: link.id || slugify(link.label || `social-link-${index + 1}`),
      type: link.type ?? "instagram",
      label: link.label || `Social Link ${index + 1}`,
      href: link.href || "#",
      displayOrder: link.displayOrder ?? index + 1,
      status: link.status ?? "ACTIVE",
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

function normalizeFooterSettings(settings?: Partial<CmsFooterSettings>): CmsFooterSettings {
  return {
    ...defaultFooterSettings,
    ...settings,
    id: "footer",
    logoUrl: settings?.logoUrl ?? defaultFooterSettings.logoUrl,
    logoAlt: settings?.logoAlt ?? defaultFooterSettings.logoAlt,
    addressLines: Array.isArray(settings?.addressLines) ? settings.addressLines : defaultFooterSettings.addressLines,
    quickLinks: normalizeFooterLinks(settings?.quickLinks, defaultFooterSettings.quickLinks),
    categoryLinks: normalizeFooterLinks(settings?.categoryLinks, defaultFooterSettings.categoryLinks),
    socialLinks: normalizeFooterSocialLinks(settings?.socialLinks, defaultFooterSettings.socialLinks),
    updatedAt: settings?.updatedAt ?? new Date().toISOString(),
  };
}

function normalizeCustomOrderOptions(
  options: Partial<Record<CmsCustomOrderOptionGroup, CmsCustomOrderOption[]>> | undefined,
): Record<CmsCustomOrderOptionGroup, CmsCustomOrderOption[]> {
  const groups: CmsCustomOrderOptionGroup[] = ["occasion", "size", "tier", "flavour", "time"];

  return groups.reduce<Record<CmsCustomOrderOptionGroup, CmsCustomOrderOption[]>>((result, group) => {
    const fallback = defaultCustomOrderOptions[group];
    result[group] = (options?.[group]?.length ? options[group] : fallback)
      .map((option, index) => ({
        ...option,
        id: option.id || slugify(option.label || `${group}-${index + 1}`),
        label: option.label || `Option ${index + 1}`,
        value: option.value || option.label || `Option ${index + 1}`,
        displayOrder: option.displayOrder ?? index + 1,
        status: option.status ?? "ACTIVE",
      }))
      .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
    return result;
  }, {} as Record<CmsCustomOrderOptionGroup, CmsCustomOrderOption[]>);
}

function normalizeCustomOrderSettings(settings?: Partial<CmsCustomOrderSettings>): CmsCustomOrderSettings {
  return {
    ...defaultCustomOrderSettings,
    ...settings,
    id: "custom-order",
    status: settings?.status ?? "ACTIVE",
    cakeTextMaxLength: Number(settings?.cakeTextMaxLength ?? defaultCustomOrderSettings.cakeTextMaxLength),
    galleryLimit: Number(settings?.galleryLimit ?? defaultCustomOrderSettings.galleryLimit),
    maxUploadImages: Number(settings?.maxUploadImages ?? defaultCustomOrderSettings.maxUploadImages),
    maxUploadSizeMb: Number(settings?.maxUploadSizeMb ?? defaultCustomOrderSettings.maxUploadSizeMb),
    autoCloseMs: Number(settings?.autoCloseMs ?? defaultCustomOrderSettings.autoCloseMs),
    enableGalleryPicker: settings?.enableGalleryPicker ?? defaultCustomOrderSettings.enableGalleryPicker,
    enableReferenceUpload: settings?.enableReferenceUpload ?? defaultCustomOrderSettings.enableReferenceUpload,
    options: normalizeCustomOrderOptions(settings?.options),
    updatedAt: settings?.updatedAt ?? new Date().toISOString(),
  };
}

function normalizeAboutItems(items: CmsAboutSectionItem[] | undefined) {
  return (items ?? [])
    .map((item, index) => ({
      ...item,
      id: item.id || slugify(item.title || item.label || `about-item-${index + 1}`),
      label: item.label || "Content Item",
      title: item.title || `Content Item ${index + 1}`,
      subtitle: item.subtitle ?? null,
      content: item.content ?? null,
      imageUrl: item.imageUrl ?? null,
      imageAlt: item.imageAlt ?? item.title ?? null,
      href: item.href ?? null,
      displayOrder: item.displayOrder ?? index + 1,
      status: item.status ?? "ACTIVE",
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));
}

function normalizeAboutSections(sections?: CmsAboutPageSection[]) {
  return (sections?.length ? sections : defaultAboutPageSections)
    .map((section, index) => {
      const sectionKey = section.sectionKey || section.id || slugify(section.label || `about-section-${index + 1}`);
      return {
        ...section,
        id: sectionKey,
        sectionKey,
        sectionType: section.sectionType ?? "content",
        label: section.label || `About Section ${index + 1}`,
        eyebrow: section.eyebrow ?? null,
        title: section.title || section.label || `About Section ${index + 1}`,
        subtitle: section.subtitle ?? null,
        content: section.content ?? null,
        imageUrl: section.imageUrl ?? null,
        imageAlt: section.imageAlt ?? null,
        ctaLabel: section.ctaLabel ?? null,
        ctaHref: section.ctaHref ?? null,
        secondaryCtaLabel: section.secondaryCtaLabel ?? null,
        secondaryCtaHref: section.secondaryCtaHref ?? null,
        displayOrder: section.displayOrder ?? index + 1,
        status: section.status ?? "ACTIVE",
        updatedAt: section.updatedAt ?? new Date().toISOString(),
        items: normalizeAboutItems(section.items),
      };
    })
    .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

function normalizeContactItems(items: CmsContactSectionItem[] | undefined) {
  return (items ?? [])
    .map((item, index) => ({
      ...item,
      id: item.id || slugify(item.title || item.label || `contact-item-${index + 1}`),
      label: item.label || "Contact Item",
      title: item.title || `Contact Item ${index + 1}`,
      subtitle: item.subtitle ?? null,
      content: item.content ?? null,
      href: item.href ?? null,
      icon: item.icon ?? null,
      displayOrder: item.displayOrder ?? index + 1,
      status: item.status ?? "ACTIVE",
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title));
}

function normalizeContactSections(sections?: CmsContactPageSection[]) {
  return (sections?.length ? sections : defaultContactPageSections)
    .map((section, index) => {
      const sectionKey = section.sectionKey || section.id || slugify(section.label || `contact-section-${index + 1}`);
      return {
        ...section,
        id: sectionKey,
        sectionKey,
        sectionType: section.sectionType ?? "content",
        label: section.label || `Contact Section ${index + 1}`,
        eyebrow: section.eyebrow ?? null,
        title: section.title || section.label || `Contact Section ${index + 1}`,
        subtitle: section.subtitle ?? null,
        content: section.content ?? null,
        imageUrl: section.imageUrl ?? null,
        imageAlt: section.imageAlt ?? null,
        mapEmbedUrl: section.mapEmbedUrl ?? null,
        ctaLabel: section.ctaLabel ?? null,
        ctaHref: section.ctaHref ?? null,
        displayOrder: section.displayOrder ?? index + 1,
        status: section.status ?? "ACTIVE",
        updatedAt: section.updatedAt ?? new Date().toISOString(),
        items: normalizeContactItems(section.items),
      };
    })
    .sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

export const defaultReviews: CmsReview[] = [
  { id: "review-1", name: "Priya Sharma", text: "Amazing quality, beautiful design and delicious taste. Everyone loved the cake.", rating: 5, date: "2 weeks ago", displayOrder: 1, status: "ACTIVE" },
  { id: "review-2", name: "Ritika Jain", text: "The customized cake exceeded our expectations. Highly recommended.", rating: 5, date: "3 weeks ago", displayOrder: 2, status: "ACTIVE" },
  { id: "review-3", name: "Aman Gupta", text: "Perfect theme cake with timely delivery and outstanding presentation.", rating: 5, date: "1 month ago", displayOrder: 3, status: "ACTIVE" },
  { id: "review-4", name: "Neha Bansal", text: "Best designer cakes in Crossing Republik. Taste and design both excellent.", rating: 5, date: "1 month ago", displayOrder: 4, status: "ACTIVE" },
  { id: "review-5", name: "Sonal Verma", text: "Neha ji understands every detail and delivers exactly what is promised.", rating: 5, date: "2 months ago", displayOrder: 5, status: "ACTIVE" },
  { id: "review-6", name: "Karan Malhotra", text: "Beautiful wedding cake and professional service.", rating: 5, date: "2 months ago", displayOrder: 6, status: "ACTIVE" },
  { id: "review-7", name: "Ankita Rao", text: "The cake became the highlight of our celebration.", rating: 5, date: "3 months ago", displayOrder: 7, status: "ACTIVE" },
  { id: "review-8", name: "Megha Singh", text: "Fresh ingredients, stunning decoration and wonderful flavor.", rating: 5, date: "3 months ago", displayOrder: 8, status: "ACTIVE" },
  { id: "review-9", name: "Rahul Mehta", text: "Ordered multiple times and every experience has been exceptional.", rating: 5, date: "4 months ago", displayOrder: 9, status: "ACTIVE" },
  { id: "review-10", name: "Divya Kapoor", text: "Creative designs, premium quality and excellent customer support.", rating: 5, date: "4 months ago", displayOrder: 10, status: "ACTIVE" },
];

function normalizeReviews(reviews: CmsReview[] | undefined) {
  return (reviews ?? defaultReviews)
    .map((review, index) => ({
      ...review,
      id: review.id || `review-${index + 1}`,
      name: review.name || `Customer ${index + 1}`,
      text: review.text || "",
      rating: Math.min(5, Math.max(1, Math.round(review.rating ?? 5))),
      date: review.date || "Recently",
      displayOrder: review.displayOrder ?? index + 1,
      status: review.status ?? "ACTIVE",
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}

async function ensureCmsFile() {
  const source = await readRawCmsData();

  if (source) {
    const parsed = source.parsed;
    const data: CmsData = {
      categories: (parsed.categories ?? defaultCategories).map((category) => ({
        ...category,
        description: category.description ?? null,
        subcategoryCtas: normalizeSubcategoryCtas(category.subcategoryCtas),
      })),
      galleryImages: (parsed.galleryImages ?? defaultGalleryImages).map((image) => ({
        ...image,
        categoryIds: image.categoryIds?.length ? image.categoryIds : image.categoryId ? [image.categoryId] : [],
        categorySlugs: image.categorySlugs?.length ? image.categorySlugs : image.categorySlug ? [image.categorySlug] : [],
        subcategoryCtaIds: image.subcategoryCtaIds ?? [],
        homeGroups: image.homeGroups ?? [],
      })),
      homePageSections: (parsed.homePageSections ?? defaultHomePageSections).map((section) => ({
        ...section,
        id: section.id || section.sectionKey,
        sectionKey: section.sectionKey || section.id,
        subtitle: section.subtitle ?? null,
        content: section.content ?? null,
        imageUrl: section.imageUrl ?? null,
        imageAlt: section.imageAlt ?? null,
        ctaLabel: section.ctaLabel ?? null,
        ctaHref: section.ctaHref ?? null,
        secondaryCtaLabel: section.secondaryCtaLabel ?? null,
        secondaryCtaHref: section.secondaryCtaHref ?? null,
        categoryCards: section.sectionKey === "categories"
          ? (section.categoryCards?.length ? section.categoryCards : defaultHomeCategoryCards)
              .map((card, index) => ({
                ...card,
                id: card.id || slugify(card.title || `category-card-${index + 1}`),
                description: card.description ?? null,
                imageUrl: card.imageUrl,
                imageAlt: card.imageAlt || card.title,
                ctaLabel: card.ctaLabel ?? section.ctaLabel ?? "Explore More",
                ctaHref: card.ctaHref ?? section.ctaHref ?? "#contact",
                displayOrder: card.displayOrder ?? index + 1,
                status: card.status ?? "ACTIVE",
              }))
          : section.categoryCards ?? [],
        whyCards: section.sectionKey === "why-us"
          ? (section.whyCards?.length ? section.whyCards : defaultHomeWhyCards)
              .map((card, index) => ({
                ...card,
                id: card.id || slugify(card.title || `why-card-${index + 1}`),
                title: card.title || `Why Card ${index + 1}`,
                text: card.text || "",
                iconUrl: card.iconUrl ?? null,
                displayOrder: card.displayOrder ?? index + 1,
                status: card.status ?? "ACTIVE",
              }))
          : section.whyCards ?? [],
        updatedAt: section.updatedAt ?? new Date().toISOString(),
      })),
      aboutPageSections: normalizeAboutSections(parsed.aboutPageSections),
      contactPageSections: normalizeContactSections(parsed.contactPageSections),
      footerSettings: normalizeFooterSettings(parsed.footerSettings),
      customOrderSettings: normalizeCustomOrderSettings(parsed.customOrderSettings),
      reviews: normalizeReviews(parsed.reviews),
    };
    // Seed the database the first time we boot from the bundled file or
    // defaults; once the row exists, reads never re-write on every request.
    if (source.from !== "db") await persistCmsDataQuietly(data);
    return data;
  }

  const initialData: CmsData = {
    categories: defaultCategories,
    galleryImages: defaultGalleryImages,
    homePageSections: defaultHomePageSections,
    aboutPageSections: defaultAboutPageSections,
    contactPageSections: defaultContactPageSections,
    footerSettings: defaultFooterSettings,
    customOrderSettings: defaultCustomOrderSettings,
    reviews: defaultReviews,
  };
  await persistCmsDataQuietly(initialData);
  return initialData;
}

// Reads the CMS document from Postgres, falling back to the bundled
// data/cms.json (used to seed the database on first boot and for local dev
// before the row exists). Returns null when neither source is available.
async function readRawCmsData(): Promise<{ parsed: Partial<CmsData>; from: "db" | "file" } | null> {
  try {
    const row = await prisma.cmsDocument.findUnique({ where: { key: CMS_DOC_KEY } });
    if (row?.data) return { parsed: row.data as Partial<CmsData>, from: "db" };
  } catch {
    // Database unreachable — fall back to the bundled file below.
  }

  try {
    const raw = await readFile(cmsPath, "utf8");
    return { parsed: JSON.parse(raw) as Partial<CmsData>, from: "file" };
  } catch {
    return null;
  }
}

async function writeCmsData(data: CmsData) {
  try {
    await prisma.cmsDocument.upsert({
      where: { key: CMS_DOC_KEY },
      create: { key: CMS_DOC_KEY, data: data as unknown as Prisma.InputJsonValue },
      update: { data: data as unknown as Prisma.InputJsonValue },
    });
    return;
  } catch (dbError) {
    // Database unreachable (e.g. local dev or an environment where DATABASE_URL
    // is not yet configured). Fall back to the bundled JSON file so edits still
    // persist wherever the filesystem is writable — the read path also prefers
    // this file when the database is unavailable.
    try {
      await writeFile(cmsPath, JSON.stringify(data, null, 2), "utf8");
      return;
    } catch {
      // No database AND a read-only filesystem: nothing can persist. Surface the
      // original database error so the caller reports the failed save.
      throw dbError;
    }
  }
}

// Best-effort DB seeding used by read paths on first boot. This intentionally
// only targets the database (never the file) so that reads don't rewrite
// data/cms.json on every request when no database is configured. A failure here
// must not discard the data we already hold in memory.
async function persistCmsDataQuietly(data: CmsData) {
  try {
    await prisma.cmsDocument.upsert({
      where: { key: CMS_DOC_KEY },
      create: { key: CMS_DOC_KEY, data: data as unknown as Prisma.InputJsonValue },
      update: { data: data as unknown as Prisma.InputJsonValue },
    });
  } catch {
    // Database not yet reachable (e.g. local dev without DATABASE_URL).
  }
}

export async function listLocalCategories({ activeOnly = false } = {}) {
  const data = await ensureCmsFile();
  return data.categories
    .filter((category) => (activeOnly ? category.status === "ACTIVE" : true))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}

export async function createLocalCategory(input: Omit<CmsCategory, "id">) {
  const data = await ensureCmsFile();
  const slug = input.slug || slugify(input.name);
  const category: CmsCategory = { ...input, id: slug, slug, subcategoryCtas: normalizeSubcategoryCtas(input.subcategoryCtas) };

  data.categories = [...data.categories.filter((item) => item.id !== category.id), category];
  await writeCmsData(data);
  return category;
}

export async function updateLocalCategory(id: string, input: Partial<Omit<CmsCategory, "id">>) {
  const data = await ensureCmsFile();
  let updated: CmsCategory | undefined;

  data.categories = data.categories.map((category) => {
    if (category.id !== id) return category;
    const nextSlug = input.slug ?? category.slug;
    updated = {
      ...category,
      ...input,
      id: nextSlug,
      slug: nextSlug,
      subcategoryCtas: normalizeSubcategoryCtas(input.subcategoryCtas ?? category.subcategoryCtas),
    };
    return updated;
  });

  await writeCmsData(data);
  return updated;
}

export async function deleteLocalCategory(id: string) {
  const data = await ensureCmsFile();
  data.categories = data.categories.filter((category) => category.id !== id);
  data.galleryImages = data.galleryImages.map((image) => {
    const categoryIds = (image.categoryIds ?? []).filter((categoryId) => categoryId !== id);
    const categorySlugs = (image.categorySlugs ?? []).filter((categorySlug) => categorySlug !== id);
    return {
      ...image,
      categoryId: image.categoryId === id ? categoryIds[0] ?? null : image.categoryId,
      categorySlug: image.categorySlug === id ? categorySlugs[0] ?? null : image.categorySlug,
      categoryIds,
      categorySlugs,
    };
  });
  await writeCmsData(data);
}

export async function listLocalReviews({ activeOnly = false } = {}) {
  const data = await ensureCmsFile();
  return data.reviews
    .filter((review) => (activeOnly ? review.status === "ACTIVE" : true))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}

export async function createLocalReview(input: Omit<CmsReview, "id">) {
  const data = await ensureCmsFile();
  const id = `review-${Date.now()}`;
  const review: CmsReview = { ...input, id };
  data.reviews = [...data.reviews, review];
  await writeCmsData(data);
  return review;
}

export async function updateLocalReview(id: string, input: Partial<Omit<CmsReview, "id">>) {
  const data = await ensureCmsFile();
  let updated: CmsReview | undefined;
  data.reviews = data.reviews.map((review) => {
    if (review.id !== id) return review;
    updated = { ...review, ...input };
    return updated;
  });
  await writeCmsData(data);
  return updated;
}

export async function deleteLocalReview(id: string) {
  const data = await ensureCmsFile();
  data.reviews = data.reviews.filter((review) => review.id !== id);
  await writeCmsData(data);
}

function resolveImageCategories(categories: CmsCategory[], categoryIds?: string[] | null, fallbackCategoryId?: string | null) {
  const requestedIds = categoryIds?.length ? categoryIds : fallbackCategoryId ? [fallbackCategoryId] : [];
  const resolved = requestedIds
    .map((categoryId) => categories.find((item) => item.id === categoryId || item.slug === categoryId))
    .filter((category): category is CmsCategory => Boolean(category));

  return {
    categoryId: resolved[0]?.id ?? fallbackCategoryId ?? null,
    categorySlug: resolved[0]?.slug ?? null,
    categoryIds: resolved.map((category) => category.id),
    categorySlugs: resolved.map((category) => category.slug),
  };
}

export async function listLocalGalleryImages(options: { category?: string | null; q?: string | null; sort?: string | null } = {}) {
  const data = await ensureCmsFile();
  const query = options.q?.toLowerCase().trim();

  return data.galleryImages
    .filter((image) => image.status === "ACTIVE")
    .filter((image) =>
      options.category
        ? image.categorySlug === options.category ||
          image.categoryId === options.category ||
          image.categorySlugs?.includes(options.category) ||
          image.categoryIds?.includes(options.category)
        : true,
    )
    .filter((image) =>
      query
        ? [image.title, image.description, image.tags, image.keywords].filter(Boolean).some((value) => value?.toLowerCase().includes(query))
        : true,
    )
    .sort((a, b) => {
      if (options.sort === "featured") return Number(b.featured) - Number(a.featured);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export async function listAllLocalGalleryImages() {
  const data = await ensureCmsFile();
  return data.galleryImages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLocalGalleryImageBySlug(slug: string) {
  const data = await ensureCmsFile();
  return data.galleryImages.find((image) => image.slug === slug && image.status === "ACTIVE") ?? null;
}

export async function createLocalGalleryImage(input: Omit<CmsGalleryImage, "id" | "createdAt">) {
  const data = await ensureCmsFile();
  const slug = input.slug || slugify(input.title);
  const categories = resolveImageCategories(data.categories, input.categoryIds, input.categoryId);
  const image: CmsGalleryImage = {
    ...input,
    id: slug,
    slug,
    ...categories,
    createdAt: new Date().toISOString(),
  };

  data.galleryImages = [...data.galleryImages.filter((item) => item.id !== image.id), image];
  await writeCmsData(data);
  return image;
}

export async function updateLocalGalleryImage(id: string, input: Partial<Omit<CmsGalleryImage, "id" | "createdAt">>) {
  const data = await ensureCmsFile();
  let updated: CmsGalleryImage | undefined;

  data.galleryImages = data.galleryImages.map((image) => {
    if (image.id !== id) return image;
    const categories = resolveImageCategories(
      data.categories,
      input.categoryIds ?? image.categoryIds,
      input.categoryId ?? image.categoryId,
    );
    const nextSlug = input.slug ?? image.slug;
    updated = {
      ...image,
      ...input,
      id: nextSlug,
      slug: nextSlug,
      ...categories,
    };
    return updated;
  });

  await writeCmsData(data);
  return updated;
}

export async function deleteLocalGalleryImage(id: string) {
  const data = await ensureCmsFile();
  data.galleryImages = data.galleryImages.filter((image) => image.id !== id);
  await writeCmsData(data);
}

export async function listAllLocalHomePageSections() {
  const data = await ensureCmsFile();
  return data.homePageSections.sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

export async function listLocalHomePageSections({ activeOnly = false } = {}) {
  const sections = await listAllLocalHomePageSections();
  return sections.filter((section) => (activeOnly ? section.status === "ACTIVE" : true));
}

export async function createLocalHomePageSection(input: Omit<CmsHomePageSection, "id" | "updatedAt">) {
  const data = await ensureCmsFile();
  const sectionKey = input.sectionKey || slugify(input.label);
  const section: CmsHomePageSection = {
    ...input,
    id: sectionKey,
    sectionKey,
    updatedAt: new Date().toISOString(),
  };

  data.homePageSections = [...data.homePageSections.filter((item) => item.id !== section.id), section];
  await writeCmsData(data);
  return section;
}

export async function updateLocalHomePageSection(id: string, input: Partial<Omit<CmsHomePageSection, "id" | "updatedAt">>) {
  const data = await ensureCmsFile();
  let updated: CmsHomePageSection | undefined;

  data.homePageSections = data.homePageSections.map((section) => {
    if (section.id !== id) return section;
    const nextSectionKey = input.sectionKey ?? section.sectionKey;
    updated = {
      ...section,
      ...input,
      id: nextSectionKey,
      sectionKey: nextSectionKey,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  await writeCmsData(data);
  return updated;
}

export async function deleteLocalHomePageSection(id: string) {
  const data = await ensureCmsFile();
  data.homePageSections = data.homePageSections.filter((section) => section.id !== id);
  await writeCmsData(data);
}

export async function listAllLocalAboutPageSections() {
  const data = await ensureCmsFile();
  return data.aboutPageSections.sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

export async function listLocalAboutPageSections({ activeOnly = false } = {}) {
  const sections = await listAllLocalAboutPageSections();
  return sections.filter((section) => (activeOnly ? section.status === "ACTIVE" : true));
}

export async function createLocalAboutPageSection(input: Omit<CmsAboutPageSection, "id" | "updatedAt">) {
  const data = await ensureCmsFile();
  const sectionKey = input.sectionKey || slugify(input.label);
  const section: CmsAboutPageSection = {
    ...input,
    id: sectionKey,
    sectionKey,
    items: normalizeAboutItems(input.items),
    updatedAt: new Date().toISOString(),
  };

  data.aboutPageSections = [...data.aboutPageSections.filter((item) => item.id !== section.id), section];
  await writeCmsData(data);
  return section;
}

export async function updateLocalAboutPageSection(id: string, input: Partial<Omit<CmsAboutPageSection, "id" | "updatedAt">>) {
  const data = await ensureCmsFile();
  let updated: CmsAboutPageSection | undefined;

  data.aboutPageSections = data.aboutPageSections.map((section) => {
    if (section.id !== id) return section;
    const nextSectionKey = input.sectionKey ?? section.sectionKey;
    updated = {
      ...section,
      ...input,
      id: nextSectionKey,
      sectionKey: nextSectionKey,
      items: normalizeAboutItems(input.items ?? section.items),
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  await writeCmsData(data);
  return updated;
}

export async function deleteLocalAboutPageSection(id: string) {
  const data = await ensureCmsFile();
  data.aboutPageSections = data.aboutPageSections.filter((section) => section.id !== id);
  await writeCmsData(data);
}

export async function listAllLocalContactPageSections() {
  const data = await ensureCmsFile();
  return data.contactPageSections.sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}

export async function listLocalContactPageSections({ activeOnly = false } = {}) {
  const sections = await listAllLocalContactPageSections();
  return sections.filter((section) => (activeOnly ? section.status === "ACTIVE" : true));
}

export async function createLocalContactPageSection(input: Omit<CmsContactPageSection, "id" | "updatedAt">) {
  const data = await ensureCmsFile();
  const sectionKey = input.sectionKey || slugify(input.label);
  const section: CmsContactPageSection = {
    ...input,
    id: sectionKey,
    sectionKey,
    items: normalizeContactItems(input.items),
    updatedAt: new Date().toISOString(),
  };

  data.contactPageSections = [...data.contactPageSections.filter((item) => item.id !== section.id), section];
  await writeCmsData(data);
  return section;
}

export async function updateLocalContactPageSection(id: string, input: Partial<Omit<CmsContactPageSection, "id" | "updatedAt">>) {
  const data = await ensureCmsFile();
  let updated: CmsContactPageSection | undefined;

  data.contactPageSections = data.contactPageSections.map((section) => {
    if (section.id !== id) return section;
    const nextSectionKey = input.sectionKey ?? section.sectionKey;
    updated = {
      ...section,
      ...input,
      id: nextSectionKey,
      sectionKey: nextSectionKey,
      items: normalizeContactItems(input.items ?? section.items),
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  await writeCmsData(data);
  return updated;
}

export async function deleteLocalContactPageSection(id: string) {
  const data = await ensureCmsFile();
  data.contactPageSections = data.contactPageSections.filter((section) => section.id !== id);
  await writeCmsData(data);
}

export async function getLocalFooterSettings() {
  const data = await ensureCmsFile();
  return data.footerSettings;
}

export async function updateLocalFooterSettings(input: Partial<CmsFooterSettings>) {
  const data = await ensureCmsFile();
  const footerSettings = normalizeFooterSettings({
    ...data.footerSettings,
    ...input,
    updatedAt: new Date().toISOString(),
  });

  data.footerSettings = footerSettings;
  await writeCmsData(data);
  return footerSettings;
}

export async function getLocalCustomOrderSettings() {
  const data = await ensureCmsFile();
  return data.customOrderSettings;
}

export async function updateLocalCustomOrderSettings(input: Partial<CmsCustomOrderSettings>) {
  const data = await ensureCmsFile();
  const customOrderSettings = normalizeCustomOrderSettings({
    ...data.customOrderSettings,
    ...input,
    updatedAt: new Date().toISOString(),
  });

  data.customOrderSettings = customOrderSettings;
  await writeCmsData(data);
  return customOrderSettings;
}
