import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n-extract";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="flex grow items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{t("forbidden.title", "403 - Forbidden")}</h1>
          <p className="text-muted-foreground">
            {t("forbidden.description", "You don't have access to this page.")}
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href="/dashboard">{t("forbidden.goDashboard", "Go to Dashboard")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
