"use client";

import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n-extract";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UnauthorizedPage() {
  const pathname = usePathname();

  return (
    <main className="flex grow items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{t("unauthorized.title", "401 - Unauthorized")}</h1>
          <p className="text-muted-foreground">{t("unauthorized.description", "Please sign in to continue.")}</p>
        </div>
        <div>
          <Button asChild>
            <Link href={`/sign-in?redirect=${pathname}`}>{t("unauthorized.signIn", "Sign in")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
