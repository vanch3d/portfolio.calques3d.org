import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { NavigationBar } from "@/components/layout";
import { SiteFooter } from "@/components/layout";
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

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
         * No-flash theme script — runs synchronously before first paint.
         * Reads localStorage and applies .dark to <html> before React hydrates,
         * preventing the flash of the wrong colour mode on page load.
         * Must be inline (not a src= script) to execute before render.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Skip link — keyboard users jump past navigation directly to content */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-bg focus:text-accent focus:shadow-md focus:font-medium focus:text-sm"
          >
            Skip to main content
          </a>

          {/*
           * Nav sentinel — zero-height element at the top of the page.
           * IntersectionObserver in NavigationBar watches this element.
           * When it leaves the viewport the nav activates the glass effect.
           */}
          <div id="nav-sentinel" aria-hidden="true" className="absolute top-0 h-px w-full pointer-events-none" />

          <NavigationBar />

          <main
            id="main-content"
            className="flex-1 pt-[var(--nav-height)]"
          >
            {children}
          </main>

          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
