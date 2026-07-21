import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Remotone - AI Video Generation",
  description: "AI-driven video generation SaaS platform",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
