import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { adminResources, type AdminResourceKey } from "./resources";
import { resourceSchemas } from "./validators";

type PrismaDelegate = {
  findMany(args?: unknown): Promise<unknown>;
  count(args?: unknown): Promise<number>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
};

function getDelegate(model: string) {
  return (prisma as unknown as Record<string, PrismaDelegate>)[model];
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireResourceAccess(resourceKey: string) {
  const resource = adminResources[resourceKey as AdminResourceKey];
  if (!resource) {
    return { error: jsonError("Unknown admin resource.", 404) };
  }

  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session?.user || !hasPermission(role, resource.permission)) {
    return { error: jsonError("You do not have permission to access this resource.", 403) };
  }

  return { resource, session };
}

export async function listResource(resourceKey: string, request: Request) {
  const access = await requireResourceAccess(resourceKey);
  if ("error" in access) return access.error;

  const url = new URL(request.url);
  const take = Math.min(Number(url.searchParams.get("take") ?? 20), 100);
  const skip = Number(url.searchParams.get("skip") ?? 0);
  const q = url.searchParams.get("q");
  const delegate = getDelegate(access.resource.model);
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { title: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : undefined;

  const [items, total] = await Promise.all([
    delegate.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: "desc" },
    }),
    delegate.count({ where }),
  ]);

  return NextResponse.json({ items, total, take, skip });
}

export async function createResource(resourceKey: string, request: Request) {
  const access = await requireResourceAccess(resourceKey);
  if ("error" in access) return access.error;

  const schema = resourceSchemas[access.resource.key];
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const delegate = getDelegate(access.resource.model);
  const item = await delegate.create({ data: parsed.data });

  return NextResponse.json({ item }, { status: 201 });
}

export async function updateResource(resourceKey: string, id: string, request: Request) {
  const access = await requireResourceAccess(resourceKey);
  if ("error" in access) return access.error;

  const schema = resourceSchemas[access.resource.key].partial();
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const delegate = getDelegate(access.resource.model);
  const item = await delegate.update({ where: { id }, data: parsed.data });

  return NextResponse.json({ item });
}

export async function deleteResource(resourceKey: string, id: string) {
  const access = await requireResourceAccess(resourceKey);
  if ("error" in access) return access.error;

  const delegate = getDelegate(access.resource.model);
  await delegate.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
