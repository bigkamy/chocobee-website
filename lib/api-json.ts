import { NextResponse } from "next/server";

export async function readJsonBody(request: Request) {
  try {
    return { data: await request.json(), response: null };
  } catch {
    return {
      data: null,
      response: NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 }),
    };
  }
}
