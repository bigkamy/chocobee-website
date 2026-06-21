import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const contact = await prisma.contactSetting.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ contact });
}
