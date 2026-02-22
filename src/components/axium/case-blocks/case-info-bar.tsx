"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { getTechLogo } from "~/lib/tech-logos";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseInfoBarProps {
  services?: string[];
  technologies?: string[];
  servicesTitle?: string;
  techTitle?: string;
  linkServicesToHome?: boolean;
}

export function CaseInfoBar({
  services,
  technologies,
  servicesTitle = "Servicios",
  techTitle = "Stack Tecnológico",
  linkServicesToHome = true,
}: CaseInfoBarProps) {
  const hasServices = services && services.length > 0;
  const hasTech = technologies && technologies.length > 0;

  if (!hasServices && !hasTech) return null;

  return (
    <section className="bg-[#f8fafb] py-12 sm:py-16">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="rounded-2xl border border-[#E5EAF3] bg-white p-6 sm:p-8"
          >
            <div
              className={`grid gap-8 ${
                hasServices && hasTech
                  ? "lg:grid-cols-2 lg:divide-x lg:divide-[#E5EAF3]"
                  : ""
              }`}
            >
              {hasServices && (
                <div className={hasTech ? "lg:pr-8" : ""}>
                  <p className="text-overline mb-4 text-[#8a919e]">
                    {servicesTitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service, i) => (
                      <motion.span
                        key={service}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.05 + i * 0.04,
                          duration: 0.3,
                          ease: smoothEase,
                        }}
                      >
                        {linkServicesToHome ? (
                          <Link
                            href="/#servicios"
                            className="text-pill inline-block rounded-full border border-[#E5EAF3] bg-[#f8fafb] px-3 py-1.5 text-[#2B2F38] transition-colors duration-300 hover:border-[#CFE3FF] hover:bg-[#EEF3FB]"
                          >
                            {service}
                          </Link>
                        ) : (
                          <span className="text-pill inline-block rounded-full border border-[#E5EAF3] bg-[#f8fafb] px-3 py-1.5 text-[#2B2F38]">
                            {service}
                          </span>
                        )}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {hasTech && (
                <div className={hasServices ? "lg:pl-8" : ""}>
                  <p className="text-overline mb-4 text-[#8a919e]">
                    {techTitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, i) => {
                      const logo = getTechLogo(tech);
                      return (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: 0.05 + i * 0.04,
                            duration: 0.3,
                            ease: smoothEase,
                          }}
                          className="text-pill inline-flex items-center gap-1.5 rounded-full border border-[#CFE3FF] bg-[#EEF5FF] px-2.5 py-1 font-semibold text-[#0072CF]"
                        >
                          {logo && (
                            <Image
                              src={logo}
                              alt=""
                              width={14}
                              height={14}
                              className="h-3.5 w-3.5 shrink-0"
                            />
                          )}
                          {tech}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
