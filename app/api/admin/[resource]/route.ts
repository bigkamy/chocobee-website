import { createResource, listResource } from "@/lib/admin/api";

export async function GET(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  return listResource(resource, request);
}

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  return createResource(resource, request);
}
