import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SliderManager from "./SliderManager";

export const dynamic = "force-dynamic";

export default async function AdminSliderPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  const images = await prisma.sliderImage.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-8 md:p-12">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-heading uppercase tracking-[0.25em] text-gray-500 mb-1">
          Panel de administración
        </p>
        <h1 className="font-heading text-4xl font-black uppercase tracking-tighter leading-none text-mx-light mb-2">
          SLIDER HERO
        </h1>
        <div className="h-0.5 w-16 bg-mx-accent" />
      </div>

      <SliderManager initialImages={images} />
    </div>
  );
}
