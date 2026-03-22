import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSettings } from "@/lib/settings";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-mx-black flex">
      <AdminSidebar userName={session.user.name || "Admin"} siteName={settings.siteName} />
      <main className="flex-1 ml-0 md:ml-64">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
