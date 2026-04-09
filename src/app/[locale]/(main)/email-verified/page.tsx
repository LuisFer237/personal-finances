import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n-extract";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: t("emailVerified.metaTitle", "Email Verified"),
};

export default function EmailVerifiedPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{t("emailVerified.title", "Email verified")}</h1>
          <p className="text-muted-foreground">
            {t("emailVerified.description", "Your email has been verified successfully.")}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard">{t("emailVerified.goDashboard", "Go to dashboard")}</Link>
        </Button>
      </div>
    </main>
  );
}
