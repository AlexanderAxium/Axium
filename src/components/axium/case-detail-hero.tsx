"use client";

import type { CaseItem } from "~/data/cases-data";

interface CaseDetailHeroProps {
  caseItem: CaseItem;
}

export function CaseDetailHero({ caseItem }: CaseDetailHeroProps) {
  const client = caseItem.client || caseItem.location;

  return (
    <div
      className="relative h-fit w-full overflow-hidden pb-[60px] pt-[100px] lg:pt-[140px] lg:pb-[80px]"
      style={{
        background: "linear-gradient(180deg, #060C20 0%, #0072CF 100%)",
      }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/10 to-primary/20" />
      <section className="mx-auto max-w-7xl font-gilroy font-normal leading-[150%] px-4 md:px-6 lg:px-8 xl:px-12 flex w-full flex-col justify-between gap-12 xl:flex-row xl:items-center">
        <div className="relative z-50">
          <div className="mb-6 text-white sm:mb-8 lg:mb-9">
            <h1 className="mb-4 max-w-[600px] font-heading text-[32px] leading-[110%] lg:mb-5 xl:text-[40px] drop-shadow-lg">
              {caseItem.title}
            </h1>
          </div>

          <div className="relative flex h-fit w-fit max-w-[600px] flex-col gap-6 rounded-xl bg-white/5 p-4 text-white backdrop-blur-xl lg:p-6 border border-white/20 shadow-2xl shadow-black/20">
            <div className="max-w-[500px]">
              <p className="text-[16px] font-medium leading-[150%]">
                {caseItem.description}
              </p>
            </div>

            {/* Desktop layout - Top row */}
            <div className="hidden flex-row md:flex md:gap-6 lg:gap-9">
              <div className="max-w-[150px]">
                <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                  Industria
                </p>
                <ul className="text-[16px] font-medium leading-[150%] text-white">
                  {caseItem.industry}
                </ul>
              </div>
              {caseItem.platform && (
                <div className="max-w-[150px]">
                  <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                    Plataforma
                  </p>
                  <ul className="text-[16px] font-medium leading-[150%] text-white">
                    {caseItem.platform}
                  </ul>
                </div>
              )}
              {caseItem.duration && (
                <div className="max-w-[150px]">
                  <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                    Duración
                  </p>
                  <ul className="text-[16px] font-medium leading-[150%] text-white">
                    {caseItem.duration}
                  </ul>
                </div>
              )}
              <div className="max-w-[150px]">
                <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                  Cliente
                </p>
                <ul className="text-[16px] font-medium leading-[150%] text-white">
                  {client}
                </ul>
              </div>
            </div>

            {/* Desktop layout - Second row */}
            <div className="hidden md:block">
              <div className="flex flex-row gap-6 lg:gap-9">
                {caseItem.secondaryIndustry && (
                  <div>
                    <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                      Industria Secundaria
                    </p>
                    <ul className="text-[16px] font-medium leading-[150%] text-white">
                      {caseItem.secondaryIndustry}
                    </ul>
                  </div>
                )}
                {caseItem.forWhom && (
                  <div>
                    <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                      Para quién
                    </p>
                    <ul className="text-[16px] font-medium leading-[150%] text-white">
                      {caseItem.forWhom}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile layout - First row */}
            <div className="flex flex-row gap-4 md:hidden">
              <div>
                <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                  Industria
                </p>
                <ul className="text-[16px] font-medium leading-[150%] text-white">
                  {caseItem.industry}
                </ul>
              </div>
              {caseItem.platform && (
                <div>
                  <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                    Plataforma
                  </p>
                  <ul className="text-[16px] font-medium leading-[150%] text-white">
                    {caseItem.platform}
                  </ul>
                </div>
              )}
              {caseItem.duration && (
                <div>
                  <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                    Duración
                  </p>
                  <ul className="text-[16px] font-medium leading-[150%] text-white">
                    {caseItem.duration}
                  </ul>
                </div>
              )}
            </div>

            {/* Mobile layout - Individual rows */}
            <div className="block md:hidden">
              <p className="mb-1 font-heading text-[15px] leading-[150%]">
                Cliente
              </p>
              <ul className="text-[16px] font-medium leading-[150%] opacity-90">
                {client}
              </ul>
            </div>
            {caseItem.secondaryIndustry && (
              <div className="block md:hidden">
                <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                  Secondary Industry
                </p>
                <ul className="text-[16px] font-medium leading-[150%] text-white">
                  {caseItem.secondaryIndustry}
                </ul>
              </div>
            )}
            {caseItem.forWhom && (
              <div className="block md:hidden">
                <p className="mb-1 font-heading text-[15px] leading-[150%] text-white/80">
                  For whom
                </p>
                <ul className="text-[16px] font-medium leading-[150%] text-white">
                  {caseItem.forWhom}
                </ul>
              </div>
            )}

            {/* Services */}
            <div>
              <p className="mb-1 max-w-full font-heading text-[15px] leading-[150%]">
                Servicios
              </p>
              <ul className="flex w-full gap-2 overflow-x-scroll pb-[10px] scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent [&::-webkit-scrollbar]:h-[4px] [&::-webkit-scrollbar]:w-[2px]">
                {caseItem.services.map((service) => (
                  <li
                    key={service}
                    className="min-w-fit text-[10px] sm:text-[11px] bg-accent/20 border border-accent/40 text-accent px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-medium transition-all duration-300 hover:bg-accent/30 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/30"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex w-full xl:w-fit relative">
          {/* Decorative glow behind image */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-secondary/30 to-transparent rounded-xl blur-2xl -z-10" />
          <img
            alt={`${caseItem.title} showcase`}
            loading="eager"
            width={566}
            height={425}
            className="max-h-[425px] w-full rounded-xl object-cover shadow-2xl shadow-black/40 ring-2 ring-white/10 xl:w-auto"
            src={caseItem.image}
          />
        </div>
      </section>
    </div>
  );
}
