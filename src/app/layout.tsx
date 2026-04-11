import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bedsecret.com"),
  title: {
    default: "Bedsecret | Personal Care Solution",
    template: "%s | Bedsecret",
  },
  description:
    "Bedsecret is a skincare-focused PWA for product discovery, member rewards, reviews, and WhatsApp ordering.",
  applicationName: "Bedsecret",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PwaRegister />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
