import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader, type SiteHeaderLabels } from "@/components/SiteHeader";
import { SiteFooter, type SiteFooterLabels } from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s · Nicolas Van Labeke",
    default: "Nicolas Van Labeke — Research & Engineering Portfolio",
  },
  description:
    "Professional portfolio of Nicolas Van Labeke — academic R&D in AI in Education and frontend engineering.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const tNav = await getTranslations("Navigation");
  const tFooter = await getTranslations("Footer");

  const headerLabels: SiteHeaderLabels = {
    siteName: tNav("site_name"),
    research: tNav("research"),
    engineering: tNav("engineering"),
    publications: tNav("publications"),
    cv: tNav("cv"),
    lab: tNav("lab"),
    openMenu: tNav("open_menu"),
    closeMenu: tNav("close_menu"),
    toggleTheme: tNav("toggle_theme"),
  };

  const footerLabels: SiteFooterLabels = {
    role: tFooter("role"),
    githubLabel: tFooter("github_label"),
    emailLabel: tFooter("email_label"),
  };

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <SiteHeader labels={headerLabels} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter labels={footerLabels} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
