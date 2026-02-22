"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "~/hooks/useTranslation";

const SERVICE_IDS = [
  "software",
  "web",
  "moviles",
  "automatizacion",
  "analitica-ia",
  "decisiones-ia",
] as const;

const SERVICE_IMAGES: Record<string, string> = {
  software: "/service1.png",
  web: "/service2.png",
  moviles: "/service3.png",
  automatizacion: "/service4.png",
  "analitica-ia": "/service5.png",
  "decisiones-ia": "/service6.png",
};

const smoothEase = [0.4, 0, 0.2, 1] as const;

export function ServicesSection() {
  const [activeTab, setActiveTab] = useState<string>(
    SERVICE_IDS[0] ?? "software"
  );
  const { t } = useTranslation("landing");

  const handleWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/51991285679?text=${encodedMessage}`, "_blank");
  };

  return (
    <section
      id="servicios"
      className="py-20 md:py-28 md:pb-16 bg-white relative overflow-hidden"
    >
      <div className="container-section">
        <div className="content-section relative">
          {/* Section Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: smoothEase }}
          >
            <span className="text-secondary font-semibold text-sm uppercase tracking-wide">
              {t("home.services.eyebrow")}
            </span>
            <h2 className="text-heading-2 text-gray-900 mt-3 mb-4">
              {t("home.services.titlePrefix")}
              <span className="bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] bg-clip-text text-transparent">
                {t("home.services.titleHighlight")}
              </span>
              {t("home.services.titleSuffix")}
            </h2>
          </motion.div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start bg-transparent p-0 h-auto border-b border-gray-200 rounded-none mb-12 overflow-x-auto scrollbar-hide">
              {SERVICE_IDS.map((id) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="relative px-3 sm:px-4 md:px-6 py-4 text-sm sm:text-base font-medium text-gray-700 data-[state=active]:text-gray-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-b-secondary data-[state=active]:border-b-2 whitespace-nowrap flex-shrink-0"
                >
                  {t(`home.services.items.${id}.label`)}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            {SERVICE_IDS.map((id) => (
              <TabsContent key={id} value={id} className="mt-0">
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
                >
                  {/* Left Column - Text */}
                  <div>
                    <h3 className="text-heading-2 text-gray-900 mb-6">
                      {t(`home.services.items.${id}.title`)}
                    </h3>
                    <p className="text-body text-gray-600 mb-6">
                      {t(`home.services.items.${id}.description`)}
                    </p>
                    <ul className="space-y-4 mb-8">
                      {[0, 1, 2].map((i) => (
                        <li
                          key={i}
                          className="flex items-start text-body text-gray-700"
                        >
                          <svg
                            className="w-6 h-6 text-secondary mr-3 mt-0.5 flex-shrink-0"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            role="img"
                            aria-label="Check icon"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {t(`home.services.items.${id}.benefits.${i}`)}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() =>
                        handleWhatsApp(
                          t(`home.services.items.${id}.whatsappMessage`)
                        )
                      }
                      className="relative inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-[#0072CF] to-[#7ECFC3] text-white font-semibold rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105 hover:shadow-[#0072CF]/50"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-[#7ECFC3] to-[#0072CF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">
                        {t("home.services.cta")}
                      </span>
                    </button>
                  </div>

                  {/* Right Column - Image */}
                  <motion.div
                    className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: smoothEase }}
                  >
                    <Image
                      src={SERVICE_IMAGES[id] ?? "/service1.png"}
                      alt={t(`home.services.items.${id}.title`)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
