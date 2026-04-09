import type { Metadata } from "next";
import { t } from "@/lib/i18n-extract";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: t("signUp.metaTitle", "Sign up"),
};

export default function SignUp() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <SignUpForm />
    </main>
  );
}
