import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amazon PPC Manager Training Program · Student Workbook",
  description:
    "Everything a student needs to master Amazon PPC — 4 phases, 10 modules, interactive exercises, auto-graded quizzes, calculators, and a capstone tracker.",
  keywords: [
    "Amazon PPC",
    "PPC Training",
    "Amazon Ads",
    "Sponsored Products",
    "ACoS",
    "TACoS",
    "Student Workbook",
  ],
  authors: [{ name: "Amazon PPC Manager Training Program" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Amazon PPC Manager Training Program",
    description:
      "Student Workbook · v2026 · 8–12 weeks · No Seller Central access required",
    siteName: "Amazon PPC Training",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#111621" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
