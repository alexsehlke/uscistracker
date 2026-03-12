"use client";

interface ServiceCenterSelectorProps {
  centers: string[];
  selected: string;
  onChange: (center: string) => void;
}

export function ServiceCenterSelector({ centers, selected, onChange }: ServiceCenterSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {centers.map((center) => (
        <button
          key={center}
          onClick={() => onChange(center)}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
            center === selected
              ? "bg-[#1d1d1f] text-white border-[#1d1d1f]"
              : "bg-white text-[#424245] border-[#e8e8ed] hover:border-[#86868b]"
          }`}
        >
          {center}
        </button>
      ))}
    </div>
  );
}
