import type { Permission } from "@/lib/permissions";

export type AdminResourceKey = "categories" | "gallery" | "about" | "team" | "contact" | "settings";

export type AdminResource = {
  key: AdminResourceKey;
  label: string;
  model: string;
  permission: Permission;
  description: string;
};

export const adminResources: Record<AdminResourceKey, AdminResource> = {
  categories: {
    key: "categories",
    label: "Categories",
    model: "category",
    permission: "categories:manage",
    description: "Add, edit, delete, sort, and publish cake categories.",
  },
  gallery: {
    key: "gallery",
    label: "Gallery Images",
    model: "galleryImage",
    permission: "gallery:manage",
    description: "Upload cake images, assign categories, edit titles, and feature designs.",
  },
  about: {
    key: "about",
    label: "About Page",
    model: "aboutContent",
    permission: "about:manage",
    description: "Edit About Chocobee text, chef name, chef description, and chef image.",
  },
  team: {
    key: "team",
    label: "Team Members",
    model: "teamMember",
    permission: "about:manage",
    description: "Add and remove team members shown on the About page.",
  },
  contact: {
    key: "contact",
    label: "Contact Details",
    model: "contactSetting",
    permission: "contact:manage",
    description: "Update phone, email, address, and WhatsApp number.",
  },
  settings: {
    key: "settings",
    label: "Website Settings",
    model: "websiteSetting",
    permission: "settings:manage",
    description: "Control logo, footer text, and social media links.",
  },
};

export const resourceList = Object.values(adminResources);
