import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
// High-contrast elegant serif, similar to Zefani / Didone style
const displaySerif = Cormorant_Garamond({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PleaseFixMyPDF",
  url: "https://pleasefixmypdf.com",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  description: "Browser-based PDF tools. Merge, split, rotate, compress. Private, no upload.",
  browserRequirements: "Requires JavaScript",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pleasefixmypdf.com"),
  title: {
    default: "PleaseFixMyPDF.com | Private Browser PDF Tools",
    template: "%s | PleaseFixMyPDF.com",
  },
  description:
    "Fast, private PDF tools for merging, splitting, rotating, and reordering PDFs directly in your browser.",
  openGraph: {
    title: "PleaseFixMyPDF.com",
    description:
      "Fast, private PDF tools for merging, splitting, rotating, and reordering PDFs directly in your browser.",
    url: "https://pleasefixmypdf.com",
    siteName: "PleaseFixMyPDF.com",
    type: "website",
    images: [{ url: "https://pleasefixmypdf.com/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PleaseFixMyPDF.com",
    description:
      "Fast, private PDF tools for merging, splitting, rotating, and reordering PDFs directly in your browser.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className={`${inter.className} ${displaySerif.variable}`}>
        <ClerkProvider
          appearance={{
            options: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
          }}
          localization={{
            signIn: {
              start: {
                title: "Sign in to PleaseFixMyPDF",
              },
            },
          }}
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
          />
          <div className="app-shell flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
