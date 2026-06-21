export type AdminRole = "ADMIN";

export type Permission =
  | "dashboard:read"
  | "categories:manage"
  | "gallery:manage"
  | "about:manage"
  | "contact:manage"
  | "settings:manage";

export function hasPermission(role: AdminRole | undefined, _permission: Permission) {
  void _permission;
  return role === "ADMIN";
}
