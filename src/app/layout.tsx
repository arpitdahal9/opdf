import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://pdfkit-app.vercel.app"),
  title: {
    default: "PDFKit | Private Browser PDF Tools",
    template: "%s | PDFKit",
  },
  description:
    "Fast, private PDF tools for merging, splitting, rotating, and reordering PDFs directly in your browser.",
  openGraph: {
    title: "PDFKit",
    description:
      "Fast, private PDF tools for merging, splitting, rotating, and reordering PDFs directly in your browser.",
    url: "https://pdfkit-app.vercel.app",
    siteName: "PDFKit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFKit",
    description:
      "Fast, private PDF tools for merging, splitting, rotating, and reordering PDFs directly in your browser.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="app-shell flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
