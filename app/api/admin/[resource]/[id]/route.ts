import { deleteResource, updateResource } from "@/lib/admin/api";

export async function PATCH(request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  return updateResource(resource, id, request);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  return deleteResource(resource, id);
}
