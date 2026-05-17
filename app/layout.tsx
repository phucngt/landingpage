import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phuc Nguyen — Data Analyst",
  description:
    "Data analyst building KPI dashboards, ETL pipelines, and customer intelligence for securities firms. SQL Server · Python · Power BI.",
  openGraph: {
    title: "Phuc Nguyen — Data Analyst",
    description:
      "Reporting systems and analytics for capital markets. SQL Server · Python · Power BI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plex.variable} ${mono.variable}`}>
      <body className="bg-white text-ink-900 font-sans antialiased selection:bg-ink-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
