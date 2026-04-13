import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TrackingScripts } from "@/components/layout/TrackingScripts";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "HappySalary - Gestion simplifiee du salaire de vos employes de maison",
    template: "%s | HappySalary",
  },
  description:
    "Payroll, cotisations sociales, assurances et contrats pour vos employes de maison. Prix fixe mensuel, sans commission.",
  metadataBase: new URL("https://happysalary.ch"),
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} h-full scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased font-sans">
        {children}
        <TrackingScripts />
      </body>
    </html>
  );
}
