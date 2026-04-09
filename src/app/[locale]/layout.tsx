import { Toaster } from "@/components/ui/sonner";
import { t } from "@/lib/i18n-extract";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Outfit } from "next/font/google";
import "./globals.css";

// Imports de traducciones
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../i18n/routing";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: t("metadata.title.template", "%s | Auto Financial"),
    absolute: t(
      "metadata.title.absolute",
      "Auto Financial - Personal Finance Manager",
    ),
  },
  description: t(
    "metadata.description",
    "Manage your personal finances with ease.",
  ),
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 1. Extraemos el locale de los params
  const { locale } = await params;

  // 2. Validamos que el locale sea uno de los permitidos
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 3. Obtenemos los mensajes del JSON correspondiente
  const messages = await getMessages();

  return (
    // Cambiamos lang="en" por el locale dinámico
    <html lang={locale} suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              richColors
              closeButton
              position="top-right"
              theme="system"
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}