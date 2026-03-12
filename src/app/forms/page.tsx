import Link from "next/link";
import { FORM_TYPES, FORM_CENTER_MAP } from "@/lib/constants";

export const metadata = {
  title: "Form Analytics",
  description: "Processing timeline analytics for all USCIS immigration forms.",
};

export default function FormsIndexPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[980px] px-5 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
          <p className="text-[#86868b] text-[14px] font-medium uppercase tracking-wider mb-3">Analytics</p>
          <h1 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.04em] leading-[1.05]">
            Form Analytics
          </h1>
          <p className="text-[19px] text-[#86868b] mt-4 max-w-[520px] mx-auto leading-[1.4]">
            Processing timelines, approval distributions, and backlog analysis for all tracked USCIS immigration forms.
          </p>
        </div>
      </section>

      {/* Form Cards */}
      <section className="bg-white">
        <div className="mx-auto max-w-[980px] px-5 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORM_TYPES.map((form, i) => {
              const centerCount = FORM_CENTER_MAP[form.id]?.length ?? 0;
              return (
                <Link key={form.id} href={`/forms/${form.id}`}>
                  <div className={`group bg-[#f5f5f7] rounded-[20px] p-7 hover:bg-[#e8e8ed] transition-colors duration-300 cursor-pointer animate-fade-in-up delay-${Math.min(i + 1, 8)}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{form.label}</h3>
                        <p className="text-[14px] text-[#86868b] mt-1 leading-relaxed">{form.fullName}</p>
                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(centerCount, 5) }).map((_, j) => (
                              <div key={j} className="w-[6px] h-[6px] rounded-full bg-[#86868b]/40" />
                            ))}
                          </div>
                          <p className="text-[12px] text-[#86868b]">{centerCount} service center{centerCount !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <span className="text-[#86868b] group-hover:text-[#0071e3] transition-colors text-[24px] leading-none">
                        &rsaquo;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
