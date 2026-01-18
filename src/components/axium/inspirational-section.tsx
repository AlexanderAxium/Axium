"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

export function InspirationalSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="py-12 md:py-16 bg-white relative overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className="relative rounded-2xl p-8 md:p-12 bg-[url('/gradient1.png')] bg-cover bg-center border border-gray-800 shadow-2xl cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="flex justify-center mb-8"
          >
            <div
              className="relative w-20 h-20 md:w-24 md:h-24 transition-all duration-500"
              style={{
                filter: isHovered
                  ? "drop-shadow(0 0 6px rgba(173, 216, 230, 0.2))"
                  : "none",
              }}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className={`object-contain transition-all duration-500 ${
                  isHovered ? "brightness-100 invert-0" : "brightness-0 invert"
                }`}
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="text-center space-y-1 max-w-full sm:max-w-3xl md:max-w-5xl mx-auto"
          >
            <p
              className="text-white text-lg sm:text-xl md:text-2xl leading-tight"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              Somos más que un proveedor de tecnología.
            </p>
            <p
              className="text-white text-lg sm:text-xl md:text-2xl leading-tight font-semibold"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              Somos tu socio tecnológico estratégico.
            </p>
            <p
              className="text-white text-lg sm:text-xl md:text-2xl leading-tight"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              Comprometidos con el éxito de tu negocio.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
