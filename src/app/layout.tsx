import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
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
      className={`${manrope.variable} h-full antialiased`}
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
