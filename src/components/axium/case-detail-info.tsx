"use client";

import Link from "next/link";
import type { CaseItem } from "~/data/cases-data";

interface CaseDetailInfoProps {
  caseItem: CaseItem;
}

export function CaseDetailInfo({ caseItem }: CaseDetailInfoProps) {
  const client = caseItem.client || caseItem.location;

  // Helper function to get flag emoji based on location (simplified)
  const getFlagEmoji = (location: string) => {
    const flags: Record<string, string> = {
      Perú: "🇵🇪",
      Ukraine: "🇺🇦",
      "United Kingdom": "🇬🇧",
      México: "🇲🇽",
      Colombia: "🇨🇴",
      Chile: "🇨🇱",
      Nashville: "🇺🇸",
    };
    return flags[location] || "";
  };

  const flagEmoji = getFlagEmoji(caseItem.location);

  return (
    <div
      className="font-gilroy bg-white text-typography-dark relative flex w-full flex-col gap-8 py-12 sm:py-14 lg:gap-12 lg:py-20"
      id="main-content"
    >
      {/* First section - Top row info */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#606776]">
              Industry
            </p>
            <div className="text-[18px] font-semibold leading-[150%] lg:text-[24px]">
              <p>{caseItem.industry}</p>
            </div>
          </div>

          {caseItem.platform && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#606776]">
                Platform
              </p>
              <div className="text-[18px] font-semibold leading-[150%] lg:text-[24px]">
                <p>{caseItem.platform}</p>
              </div>
            </div>
          )}

          {caseItem.duration && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#606776]">
                Duration
              </p>
              <div className="text-[18px] font-semibold leading-[150%] lg:text-[24px]">
                <p>{caseItem.duration}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#606776]">
              Client
            </p>
            <div className="flex items-center gap-3 text-[18px] font-semibold leading-[150%] lg:text-[24px]">
              {flagEmoji && (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F5FB] text-[16px] lg:h-10 lg:w-10 lg:text-[22px]">
                  {flagEmoji}
                </span>
              )}
              <div className="flex flex-col">
                <p>{client}</p>
                {caseItem.location && caseItem.location !== client && (
                  <span className="text-xs font-medium text-[#7A8293]">
                    {caseItem.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="border-t border-[#E5EAF3] pt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#606776]">
            Services
          </p>
          <ul className="flex w-full flex-wrap gap-2">
            {caseItem.services.map((service) => (
              <Link
                key={service}
                href="/#servicios"
                className="rounded-full border border-[#E5EAF3] bg-[#F7F9FC] px-4 py-2 text-sm font-medium text-[#2B2F38] transition-colors duration-300 hover:bg-[#EEF3FB]"
              >
                {service}
              </Link>
            ))}
          </ul>
        </div>
      </section>

      {/* Technology Stack section */}
      {caseItem.technologyStack && caseItem.technologyStack.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="border-t border-[#E5EAF3] pt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#606776]">
              Technology Stack
            </p>
            <ul className="flex w-full flex-wrap gap-2">
              {caseItem.technologyStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-[#CFE3FF] bg-[#EEF5FF] px-4 py-2 text-sm font-semibold text-[#1C5ED8]"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Flare effect - decorative background element */}
      <div
        className="pointer-events-none absolute -z-0 overflow-visible w-96 h-96 bottom-[25%] left-1/2 -translate-x-1/2 opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #1763FA 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
