import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduPlan BNCC-SAEB - Sistema de Gestão Educacional",
  description: "Plataforma completa para planejamento de aulas BNCC, criação de provas SAEB com IA e análise de desempenho estudantil",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div className="min-h-screen flex">
          <Navigation />
          <main className="flex-1 ml-0 lg:ml-64 min-h-screen">
            <div className="p-4 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}