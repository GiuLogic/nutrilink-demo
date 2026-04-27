"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Utensils, Settings, BarChart3, PlayCircle } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Inicio", color: "text-green-600" },
  { href: "/demo", icon: PlayCircle, label: "Demo", color: "text-orange-600" },
  { href: "/familia", icon: Utensils, label: "Familia", color: "text-green-600" },
  { href: "/admin", icon: Settings, label: "ONG", color: "text-orange-600" },
  { href: "/dashboard", icon: BarChart3, label: "Impacto", color: "text-blue-600" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 safe-area-bottom"
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around py-1">
        {NAV_ITEMS.map(({ href, icon: Icon, label, color }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all tap-target min-w-[60px]
                ${isActive
                  ? `${color} bg-gray-100 font-semibold scale-105`
                  : "text-gray-400 hover:text-gray-600"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
