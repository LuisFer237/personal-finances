import type { Metadata } from "next";
import { t } from "@/lib/i18n-extract";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: t("forgotPassword.metaTitle", "Forgot password"),
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="space-y-6 w-full">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">{t("forgotPassword.title", "Forgot password")}</h1>
          <p className="text-muted-foreground">
            {t(
              "forgotPassword.description",
              "Enter your email address and we'll send you a link to reset your password.",
            )}
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
