import type {Metadata} from "next";
import {Geist_Mono, Montserrat, Onest, Puppies_Play} from "next/font/google";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import {Toaster} from "@/components/ui/sonner";

import "./globals.css";
import React from "react";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});

const puppiesPlay = Puppies_Play({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-puppies-play",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${onest.variable} ${puppiesPlay.variable} ${montserrat.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="from-background flex h-dvh flex-col overscroll-none bg-gradient-to-b to-pink-300/50 dark:to-pink-950/30">
        <section className="flex h-full flex-col overflow-y-scroll">
          <Providers>
            <header className="sticky inset-x-0 top-0 z-50 border-b border-dashed border-rose-100 dark:border-pink-300/20">
              <Navbar />
            </header>

            <main className="mx-auto w-full max-w-7xl flex-grow p-6 lg:px-8">
              {children}
            </main>

            <footer>
              <Footer />
            </footer>
          </Providers>
          <Toaster />
        </section>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Moments",
  description:
    "Moments is your personal gallery where every photo and video tells a story. Revisit memories anytime, beautifully organized and effortlessly accessible—because your moments deserve to last forever.",
  icons: [{rel: "icon", url: "/moments.svg"}],
};
