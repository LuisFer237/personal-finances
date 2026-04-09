import type { Metadata } from "next";
import { t } from "@/lib/i18n-extract";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: t("resetPassword.metaTitle", "Reset password"),
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      {token ? (
        <ResetPasswordUI token={token} />
      ) : (
        <div role="alert" className="text-red-600">
          {t("resetPassword.tokenMissing", "Token is missing.")}
        </div>
      )}
    </main>
  );
}

interface ResetPasswordUIProps {
  token: string;
}

function ResetPasswordUI({ token }: ResetPasswordUIProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">{t("resetPassword.title", "Reset password")}</h1>
        <p className="text-muted-foreground">{t("resetPassword.description", "Enter your new password below.")}</p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}
