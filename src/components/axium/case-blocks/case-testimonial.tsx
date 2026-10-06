"use client";

import { Quote } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseTestimonialProps {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

export function CaseTestimonial({
  quote,
  name,
  role,
  avatar,
}: CaseTestimonialProps) {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-28">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #060C20 0%, #0a1628 50%, #0072CF 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-[#7ECFC3]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[#0072CF]/15 blur-[100px]" />
      </div>

      <div className="relative z-10 container-section">
        <div className="content-section max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#7ECFC3]/15">
              <Quote className="h-6 w-6 text-[#7ECFC3]" />
            </div>

            <blockquote className="mb-8 text-xl font-medium leading-relaxed text-white/90 sm:text-2xl lg:text-3xl">
              &ldquo;{quote}&rdquo;
            </blockquote>

            <div className="flex items-center gap-4">
              {avatar && (
                <Image
                  src={avatar}
                  alt={name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                />
              )}
              <div className={avatar ? "text-left" : "text-center"}>
                <p className="text-body font-bold text-white">{name}</p>
                <p className="text-body-sm text-white/60">{role}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
