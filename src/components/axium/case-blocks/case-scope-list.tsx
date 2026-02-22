"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

interface CaseScopeListProps {
  title?: string;
  subtitle?: string;
  items: string[];
  columns?: 1 | 2;
}

export function CaseScopeList({
  title = "Alcance del Proyecto",
  subtitle = "Entregables",
  items,
  columns = 2,
}: CaseScopeListProps) {
  if (!items || items.length === 0) return null;

  const midpoint = Math.ceil(items.length / 2);
  const col1 = columns === 2 ? items.slice(0, midpoint) : items;
  const col2 = columns === 2 ? items.slice(midpoint) : [];

  return (
    <section className="bg-white py-14 sm:py-18 lg:py-24">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="mb-10"
          >
            <p className="text-overline mb-3 text-[#0072CF]">{subtitle}</p>
            <h2 className="text-heading-1 text-[#060C20]">{title}</h2>
          </motion.div>

          <div
            className={`grid gap-x-12 gap-y-0 ${
              columns === 2 ? "lg:grid-cols-2" : ""
            }`}
          >
            {[col1, ...(col2.length > 0 ? [col2] : [])].map((col, colIdx) => (
              <div
                key={colIdx === 0 ? "col-1" : "col-2"}
                className="flex flex-col"
              >
                {col.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: (colIdx * col1.length + i) * 0.05,
                      ease: smoothEase,
                    }}
                    className="flex items-center gap-3 border-b border-[#E5EAF3] py-4 last:border-0"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#7ECFC3]" />
                    <span className="text-body text-[#2B2F38]">{item}</span>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
