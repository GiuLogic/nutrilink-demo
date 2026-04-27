import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { BottomNav } from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NutriLink — Inteligencia Nutricional para la Seguridad Alimentaria",
  description: "Capa de inteligencia nutricional, económica y predictiva que transforma excedentes alimentarios en menús equilibrados y dignos para familias vulnerables. Acción Contra el Hambre · Madrid Innovation 2026.",
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen pb-20`}>
        <AccessibilityProvider>
          {children}
          <BottomNav />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
