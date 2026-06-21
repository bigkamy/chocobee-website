import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !hasPermission(session.user.role, "dashboard:read")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [categories, galleryImages, teamMembers] = await Promise.all([
    prisma.category.count(),
    prisma.galleryImage.count(),
    prisma.teamMember.count(),
  ]);

  return NextResponse.json({
    metrics: {
      categories,
      galleryImages,
      teamMembers,
    },
  });
}
