import type { Metadata } from "next";
import { t } from "@/lib/i18n-extract";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: t("signIn.metaTitle", "Sign in"),
};

export default function SignIn() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <SignInForm />
    </main>
  );
}
