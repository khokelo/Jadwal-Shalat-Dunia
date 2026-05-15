import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "NOOR — Global Prayer Intelligence Platform",
    template: "%s | NOOR",
  },
  description: "Enterprise-grade realtime global prayer monitoring, visualization, and analysis platform for 1.8 billion Muslims worldwide.",
  keywords: ["prayer times", "salat", "islamic", "global", "realtime", "dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <AuroraBackground>
            <Navbar />
            <main className="flex-1 w-full pt-16">
              {children}
            </main>
          </AuroraBackground>
        </Providers>
      </body>
    </html>
  );
}
