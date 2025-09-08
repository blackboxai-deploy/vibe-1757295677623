"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: "📊",
    description: "Visão geral do sistema",
  },
  {
    name: "Planejamento BNCC",
    href: "/planejamento",
    icon: "📚",
    description: "Criar planos de aula",
  },
  {
    name: "Provas com IA",
    href: "/provas",
    icon: "🤖",
    description: "Gerar avaliações SAEB",
  },
  {
    name: "Correção Automática",
    href: "/correcao",
    icon: "📷",
    description: "Ler cartão resposta",
  },
  {
    name: "Relatórios",
    href: "/relatorios",
    icon: "📈",
    description: "Análise de desempenho",
  },
];

function NavigationContent() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EduPlan</h1>
            <p className="text-xs text-gray-500">BNCC-SAEB</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100",
                pathname === item.href
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:text-gray-900"
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm text-gray-600">
            Sistema Educacional
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Baseado na BNCC e SAEB
          </div>
        </div>
      </div>
    </div>
  );
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">EduPlan BNCC-SAEB</h1>
            </div>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <NavigationContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="h-20" /> {/* Spacer for fixed header */}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
        <div className="flex h-full flex-col bg-white border-r border-gray-200">
          <NavigationContent />
        </div>
      </div>
    </>
  );
}