// app/layout.tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast"; // ✅ Importera Toaster

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kursvinnare Modern",
  description: "Modern applikation att hitta kursvinnare",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionWrapper>
            <Navbar />
            <main className="p-4">{children}</main>
            <Toaster position="top-right" /> {/* ✅ Här! */}
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
