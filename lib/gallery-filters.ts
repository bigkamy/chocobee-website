// Shared option lists for the gallery filter attributes. Used by both the admin
// "Add Cake Image" form and the public gallery filter bar so the values stay in
// sync. Size is derived from the existing minCakeSizeKg number via a bucket.

export const GALLERY_GENDERS = ["Boy", "Girl", "Unisex"] as const;

export const GALLERY_AGE_GROUPS = [
  "1st Birthday",
  "Kids (2-9)",
  "Pre-Teen (10-12)",
  "Teen (13-19)",
  "Adult",
] as const;

// Reused from the Custom Order flavour options.
export const GALLERY_FLAVOURS = [
  "Chocolate",
  "Vanilla",
  "Strawberry",
  "Red Velvet",
  "Black Forest",
  "Butterscotch",
  "Pineapple",
] as const;

// Reused from the Custom Order tier options.
export const GALLERY_TIERS = ["Single Tier", "2-Tier", "3-Tier", "Multi-Tier"] as const;

export const GALLERY_SIZE_BUCKETS = ["Up to 1 kg", "1-2 kg", "2-3 kg", "3 kg & above"] as const;

// The toggleable gallery filter fields (admin can turn each on/off).
export const GALLERY_FILTER_FIELDS = [
  { key: "gender", label: "Gender" },
  { key: "age", label: "Age" },
  { key: "size", label: "Size" },
  { key: "flavour", label: "Flavour" },
  { key: "tier", label: "Tier" },
] as const;

export const GALLERY_FILTER_KEYS = GALLERY_FILTER_FIELDS.map((field) => field.key);

export type GalleryFilterKey = (typeof GALLERY_FILTER_FIELDS)[number]["key"];

// Maps a minimum cake size (kg) to its filter bucket label.
export function sizeBucketOf(kg: number | null | undefined): (typeof GALLERY_SIZE_BUCKETS)[number] {
  const value = typeof kg === "number" && kg > 0 ? kg : 0.5;
  if (value <= 1) return "Up to 1 kg";
  if (value <= 2) return "1-2 kg";
  if (value <= 3) return "2-3 kg";
  return "3 kg & above";
}
