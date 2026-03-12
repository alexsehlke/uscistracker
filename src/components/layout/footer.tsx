import Link from "next/link";
import { FORM_TYPES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[#f5f5f7]">
      <div className="mx-auto max-w-[980px] px-5">
        {/* Links */}
        <div className="py-5 border-b border-[#d2d2d7]/60">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[12px] font-semibold text-[#1d1d1f] mb-2">Navigation</p>
              <div className="space-y-1.5">
                <Link href="/" className="block text-[12px] text-[#424245] hover:text-[#1d1d1f] transition-colors">Home</Link>
                <Link href="/cases" className="block text-[12px] text-[#424245] hover:text-[#1d1d1f] transition-colors">Case Lookup</Link>
                <Link href="/forms" className="block text-[12px] text-[#424245] hover:text-[#1d1d1f] transition-colors">Form Analytics</Link>
                <Link href="/about" className="block text-[12px] text-[#424245] hover:text-[#1d1d1f] transition-colors">About</Link>
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#1d1d1f] mb-2">Forms</p>
              <div className="space-y-1.5">
                {FORM_TYPES.slice(0, 4).map((form) => (
                  <Link key={form.id} href={`/forms/${form.id}`} className="block text-[12px] text-[#424245] hover:text-[#1d1d1f] transition-colors">
                    {form.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#1d1d1f] mb-2">&nbsp;</p>
              <div className="space-y-1.5">
                {FORM_TYPES.slice(4).map((form) => (
                  <Link key={form.id} href={`/forms/${form.id}`} className="block text-[12px] text-[#424245] hover:text-[#1d1d1f] transition-colors">
                    {form.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#1d1d1f] mb-2">Resources</p>
              <div className="space-y-1.5">
                <span className="block text-[12px] text-[#424245]">USCIS Official Site</span>
                <span className="block text-[12px] text-[#424245]">Developer API</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="text-[12px] text-[#86868b]">
            Copyright &copy; {new Date().getFullYear()} USCISTracker. Not affiliated with USCIS or the U.S. government.
          </p>
          <p className="text-[12px] text-[#86868b]">
            Data sourced from the official USCIS API.
          </p>
        </div>
      </div>
    </footer>
  );
}
