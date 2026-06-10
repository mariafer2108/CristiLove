
'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CristiLove - Gestión de Papelería",
  description: "Sistema de gestión para emprendimiento de papelería creativa",
};

export default function RootLayout({
  children,
}: Readonly&lt;{
  children: React.ReactNode;
}&gt;) {
  return (
    &lt;html lang="es" className="h-full antialiased"&gt;
      &lt;body className={`${inter.className} h-full bg-background`}&gt;
        &lt;AuthProvider&gt;
          &lt;div className="flex h-screen overflow-hidden"&gt;
            &lt;Sidebar /&gt;
            &lt;main className="flex-1 overflow-y-auto pt-20 pb-8 px-4 md:pt-8 md:px-8 md:pl-72"&gt;
              {children}
            &lt;/main&gt;
          &lt;/div&gt;
        &lt;/AuthProvider&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  );
}
