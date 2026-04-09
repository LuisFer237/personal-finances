import { getServerSession } from "@/lib/get-session";
import { t } from "@/lib/i18n-extract";
import type { Metadata } from "next";
import { forbidden, unauthorized } from "next/navigation";
import { DeleteApplication } from "./delete-application";

export const metadata: Metadata = {
  title: t("admin.metaTitle", "Admin"),
};

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  if (user.role !== "admin") forbidden();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{t("admin.title", "Admin")}</h1>
          <p className="text-muted-foreground">
            {t("admin.description", "You have administrator access.")}
          </p>
        </div>
        <DeleteApplication />
      </div>
    </main>
  );
}
