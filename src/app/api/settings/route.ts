import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSettings, updateSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  await updateSettings(body);
  const settings = await getSettings();

  // Purge cached pages so the new theme applies immediately
  revalidatePath("/", "layout");

  return NextResponse.json(settings);
}
