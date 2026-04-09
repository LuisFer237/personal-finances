import betterAuthLogo from "@/assets/better_auth_logo.png";
import codingInFlowLogo from "@/assets/coding_in_flow_logo.jpg";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n-extract";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-8 flex items-center justify-center gap-4">
          <Image
            src={codingInFlowLogo}
            alt={t("home.codingInFlowLogoAlt", "Coding in Flow logo")}
            width={80}
            height={80}
            className="border-muted rounded-full border"
          />
          <span className="text-muted-foreground text-2xl font-bold">+</span>
          <Image
            src={betterAuthLogo}
            alt={t("home.betterAuthLogoAlt", "Better Auth logo")}
            width={80}
            height={80}
            className="border-muted rounded-full border"
          />
        </div>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          {t("home.title", "Auto Financial - Personal Finance Manager")}
        </h1>
        <p className="text-muted-foreground mt-3 text-base text-balance sm:text-lg">
          {t(
            "home.description",
            "Learn how to handle authentication in Next.js using Better-Auth with this tutorial by",
          )}{" "}
          <Link
            href="https://www.youtube.com/c/codinginflow?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {t("home.codingInFlow", "Coding in Flow")}
          </Link>
        </p>
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/dashboard">{t("home.goDashboard", "Go to Dashboard")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/sign-in">{t("home.signIn", "Sign In")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
