import Link from "next/link";
import { FORM_TYPES, FORM_CENTER_MAP } from "@/lib/constants";

export default function HomePage() {
  return (
    <div>
      {/* Hero — Dark section, Apple style */}
      <section className="bg-black text-white overflow-hidden">
        <div className="mx-auto max-w-[980px] px-5 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-[56px] sm:text-[80px] font-semibold tracking-[-0.04em] leading-[1.05]">
              Your USCIS case.
              <br />
              <span className="text-gradient">Tracked daily.</span>
            </h1>
            <p className="text-[21px] text-[#86868b] mt-5 max-w-[600px] mx-auto leading-[1.4] font-normal">
              Processing timelines, approval analytics, and real-time status
              updates for every major immigration form.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8">
              <Link href="/cases" className="text-[20px] text-[#2997ff] hover:underline font-normal">
                Look up a case &rsaquo;
              </Link>
              <Link href="/forms" className="text-[20px] text-[#2997ff] hover:underline font-normal">
                View analytics &rsaquo;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[980px] px-5 py-5">
          <div className="flex items-center justify-center gap-10 sm:gap-16 text-center">
            <div>
              <p className="text-[28px] sm:text-[32px] font-semibold text-[#1d1d1f] tracking-tight">8</p>
              <p className="text-[12px] text-[#86868b]">Form types</p>
            </div>
            <div className="w-px h-8 bg-[#d2d2d7]" />
            <div>
              <p className="text-[28px] sm:text-[32px] font-semibold text-[#1d1d1f] tracking-tight">11</p>
              <p className="text-[12px] text-[#86868b]">Service centers</p>
            </div>
            <div className="w-px h-8 bg-[#d2d2d7]" />
            <div>
              <p className="text-[28px] sm:text-[32px] font-semibold text-[#1d1d1f] tracking-tight">Daily</p>
              <p className="text-[12px] text-[#86868b]">Data updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Lookup CTA — Dark section */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[980px] px-5 py-20 sm:py-28 text-center">
          <p className="text-[#86868b] text-[14px] font-medium uppercase tracking-wider mb-3">Case Status</p>
          <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-[1.08]">
            Know where you stand.
          </h2>
          <p className="text-[19px] text-[#86868b] mt-4 max-w-[500px] mx-auto leading-[1.4]">
            Enter your 13-character receipt number for instant access to your case status and full processing history.
          </p>
          <Link href="/cases" className="inline-block mt-8 text-[20px] text-[#2997ff] hover:underline">
            Check your case status &rsaquo;
          </Link>
        </div>
      </section>

      {/* Form Types — White section */}
      <section className="bg-white">
        <div className="mx-auto max-w-[980px] px-5 py-20 sm:py-24">
          <div className="text-center mb-14">
            <p className="text-[#86868b] text-[14px] font-medium uppercase tracking-wider mb-3">Analytics</p>
            <h2 className="text-[48px] sm:text-[56px] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-[1.08]">
              Processing timelines.
            </h2>
            <p className="text-[19px] text-[#86868b] mt-4 max-w-[540px] mx-auto leading-[1.4]">
              Backlog snapshots, approval rates, and processing trends for all tracked USCIS forms.
            </p>
          </div>

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
                        <p className="text-[12px] text-[#86868b] mt-3">{centerCount} service center{centerCount !== 1 ? "s" : ""}</p>
                      </div>
                      <span className="text-[#86868b] group-hover:text-[#0071e3] transition-colors text-[21px] mt-1">
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

      {/* How It Works — Gray section */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-[980px] px-5 py-20 sm:py-24">
          <div className="text-center mb-14">
            <h2 className="text-[48px] sm:text-[56px] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-[1.08]">
              How it works.
            </h2>
            <p className="text-[19px] text-[#86868b] mt-4">Three steps. That&apos;s all it takes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Enter your receipt number",
                desc: "Your 13-character receipt number from your notice of action. That's the only thing you need.",
              },
              {
                step: "02",
                title: "View your case status",
                desc: "Get real-time case status directly from USCIS, with a complete history of every update.",
              },
              {
                step: "03",
                title: "Explore analytics",
                desc: "See how your form type is being processed across service centers, approval trends, and wait times.",
              },
            ].map((item, i) => (
              <div key={i} className={`bg-white rounded-[20px] p-8 animate-fade-in-up delay-${i + 1}`}>
                <p className="text-[48px] font-semibold text-[#1d1d1f]/10 tracking-tight leading-none mb-6">{item.step}</p>
                <h3 className="text-[19px] font-semibold text-[#1d1d1f] mb-2">{item.title}</h3>
                <p className="text-[14px] text-[#86868b] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA — Dark section */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-[980px] px-5 py-20 sm:py-28 text-center">
          <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.03em] leading-[1.08]">
            Start tracking today.
          </h2>
          <p className="text-[19px] text-[#86868b] mt-4 max-w-[480px] mx-auto leading-[1.4]">
            Free. No account required. Just your receipt number.
          </p>
          <Link href="/cases" className="inline-block mt-8 bg-[#0071e3] text-white text-[17px] font-normal px-7 py-3 rounded-full hover:bg-[#0077ed] transition-colors">
            Look Up Your Case
          </Link>
        </div>
      </section>
    </div>
  );
}
