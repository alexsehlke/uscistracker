"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/cases", label: "Case Lookup" },
    { href: "/forms", label: "Forms" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="apple-nav sticky top-0 z-50 border-b border-[#d2d2d7]/60">
      <div className="mx-auto max-w-[980px] px-5">
        <div className="flex h-[44px] items-center justify-between">
          <Link href="/" className="text-[12px] font-semibold text-[#1d1d1f] hover:text-[#1d1d1f]/70 transition-colors">
            USCISTracker
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[12px] transition-colors",
                  (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                    ? "text-[#1d1d1f] font-medium"
                    : "text-[#424245] hover:text-[#1d1d1f]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 -mr-1.5"
            aria-label="Menu"
          >
            <svg className="w-[18px] h-[18px] text-[#1d1d1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-6 pt-1 animate-fade-in">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block py-2 text-[15px] transition-colors border-b border-[#d2d2d7]/40",
                  (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                    ? "text-[#1d1d1f] font-medium"
                    : "text-[#86868b]"
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
