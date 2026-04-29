import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vinea — Wines that mean something",
  description:
    "Vinea 2.0 — wines and bubbles, taste-curated. Particulier, bedrijven, horeca. Belgian-curated, soul-built.",
  openGraph: {
    title: "Vinea — Wines that mean something",
    description: "Vinea 2.0 — wines and bubbles, taste-curated.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,500&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="grain">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
