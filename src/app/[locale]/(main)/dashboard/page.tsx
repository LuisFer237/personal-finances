import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@/lib/auth";
import { getServerSession } from "@/lib/get-session";
import { t } from "@/lib/i18n-extract";
import { format } from "date-fns";
import { CalendarDaysIcon, MailIcon, ShieldIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { unauthorized } from "next/navigation";
import WalletDashboard from "./wallet-dashboard";

export const metadata: Metadata = {
  title: t("dashboard.metaTitle", "Dashboard"),
};

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">{t("dashboard.title", "Dashboard")}</h1>
          <p className="text-muted-foreground">
            {t("dashboard.welcome", "Welcome back! Here's your account overview.")}
          </p>
        </div>
        {!user.emailVerified && <EmailVerificationAlert />}
        <ProfileInformation user={user} />
        <WalletDashboard searchParams={searchParams} />
      </div>
    </main>
  );
}

interface ProfileInformationProps {
  user: User;
}

function ProfileInformation({ user }: ProfileInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="size-5" />
          {t("dashboard.profileInfo", "Profile Information")}
        </CardTitle>
        <CardDescription>
          {t("dashboard.profileInfoDescription", "Your account details and current status")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <UserAvatar
              name={user.name}
              image={user.image}
              className="size-32 sm:size-24"
            />
            {user.role && (
              <Badge>
                <ShieldIcon className="size-3" />
                {user.role}
              </Badge>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-semibold">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarDaysIcon className="size-4" />
                {t("dashboard.memberSince", "Member Since")}
              </div>
              <p className="font-medium">
                {format(user.createdAt, "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmailVerificationAlert() {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-950/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MailIcon className="size-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-800 dark:text-yellow-200">
            {t("dashboard.verifyEmailAlert", "Please verify your email address to access all features.")}
          </span>
        </div>
        <Button size="sm" asChild>
          <Link href="/verify-email">{t("dashboard.verifyEmail", "Verify Email")}</Link>
        </Button>
      </div>
    </div>
  );
}
