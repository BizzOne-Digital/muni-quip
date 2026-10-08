import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MUNI-QUIP | Municipal Equipment, Parts & Service in Ontario & Quebec",
  description:
    "Municipal equipment, asphalt recycling, road maintenance, winter maintenance, fleet technology, parts and service solutions across Ontario and Quebec.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://muni-quip.ca"),
  openGraph: {
    siteName: "MUNI-QUIP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
