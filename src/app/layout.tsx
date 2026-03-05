import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForzaAI — Your Training, Understood",
  description:
    "Connect your Strava account and get AI-powered insights about your athletic performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.className}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
