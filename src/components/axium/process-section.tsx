"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProcessSectionDesktop } from "~/components/axium/process-section-desktop";
import { ProcessSectionMobile } from "~/components/axium/process-section-mobile";
import { useTranslation } from "~/hooks/useTranslation";

const STEP_IDS = ["definir", "construir", "lanzar"] as const;
const AUTO_ADVANCE_MS = 4000;
const smoothEase = [0.4, 0, 0.2, 1] as const;

export function ProcessSection() {
  const { t } = useTranslation("landing");
  const [activeStep, setActiveStep] = useState(0);
  const prevStepRef = useRef(0);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleStepChange = useCallback(
    (newStep: number) => {
      prevStepRef.current = activeStep;
      setActiveStep(newStep);
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    },
    [activeStep]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(!!entry?.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    autoTimerRef.current = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % STEP_IDS.length;
        prevStepRef.current = prev;
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      id="como-trabajamos"
      className="py-16 md:py-22 bg-white relative overflow-hidden"
    >
      <div className="container-section">
        <div className="content-section relative">
          <div className="mb-12 text-center">
            <motion.h2
              className="text-heading-1 text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: smoothEase }}
            >
              {t("home.process.titlePrefix")}
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                {t("home.process.titleHighlight")}
              </span>
            </motion.h2>
            <motion.p
              className="text-gray-500 text-body max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
            >
              {t("home.process.description")}
            </motion.p>
          </div>

          <div className="md:hidden">
            <ProcessSectionMobile
              activeStep={activeStep}
              onStepChange={handleStepChange}
            />
          </div>

          <div className="hidden md:block relative mb-16">
            <ProcessSectionDesktop
              activeStep={activeStep}
              onStepChange={handleStepChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
