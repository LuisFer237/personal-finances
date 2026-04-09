"use client";

import { LoadingButton } from "@/components/loading-button";
import { authClient } from "@/lib/auth-client";
import { t } from "@/lib/i18n-extract";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LogoutEverywhereButton() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogoutEverywhere() {
    setLoading(true);
    const { error } = await authClient.revokeSessions();
    setLoading(false);

    if (error) {
      toast.error(error.message || t("profile.logoutEverywhere.failed", "Failed to log out everywhere"));
    } else {
      toast.success(t("profile.logoutEverywhere.success", "Logged out from all devices"));
      router.push("/sign-in");
    }
  }

  return (
    <LoadingButton
      variant="destructive"
      onClick={handleLogoutEverywhere}
      loading={loading}
      className="w-full"
    >
      {t("profile.logoutEverywhere.button", "Log out everywhere")}
    </LoadingButton>
  );
}
