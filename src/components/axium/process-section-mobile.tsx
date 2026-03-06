"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { useTranslation } from "~/hooks/useTranslation";

const STEP_IDS = ["definir", "construir", "lanzar"] as const;
const STEP_IMAGES = [
  "/process-1.png",
  "/process-2.png",
  "/process-3.png",
] as const;
const smoothEase = [0.4, 0, 0.2, 1] as const;

export interface ProcessSectionMobileProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export function ProcessSectionMobile({
  activeStep,
  onStepChange,
}: ProcessSectionMobileProps) {
  const { t } = useTranslation("landing");
  const [api, setApi] = useState<CarouselApi>();
  const fromCarousel = useRef(false);

  // Opts estables: sin startIndex ni referencias cambiantes para que Embla
  // nunca reinicialice (un reInit hace el salto instantáneo al soltar).
  const carouselOpts = useMemo(
    () => ({
      align: "start" as const,
      loop: true,
      skipSnaps: false,
      dragFree: false,
    }),
    []
  );

  // Carousel → padre
  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      fromCarousel.current = true;
      onStepChange(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onStepChange]);

  // Padre → carousel (solo cuando el cambio vino de fuera: clic en indicador o auto-advance)
  useEffect(() => {
    if (api == null) return;
    if (fromCarousel.current) {
      fromCarousel.current = false;
      return;
    }
    api.scrollTo(activeStep);
  }, [api, activeStep]);

  return (
    <>
      <div className="mb-6">
        <div className="relative flex justify-between px-6">
          <div className="absolute top-4 left-10 right-10 h-0.5 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-secondary rounded-full origin-left"
              initial={false}
              animate={{
                scaleX: activeStep / (STEP_IDS.length - 1),
              }}
              transition={{ duration: 0.5, ease: smoothEase }}
            />
          </div>
          {STEP_IDS.map((id, index) => (
            <button
              key={id}
              type="button"
              onClick={() => onStepChange(index)}
              className="flex flex-col items-center gap-1.5 relative z-10"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  index <= activeStep
                    ? "bg-secondary text-white shadow-md shadow-secondary/25"
                    : "bg-white text-gray-400 border-2 border-gray-200"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  index === activeStep ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {t(`home.process.steps.${id}.title`)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={carouselOpts}
        className="w-full overflow-hidden"
      >
        <CarouselContent className="ml-0">
          {STEP_IDS.map((id, index) => (
            <CarouselItem key={id} className="pl-0 basis-full">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="relative flex items-center justify-center min-h-[200px]">
                  <Image
                    src={STEP_IMAGES[index] ?? STEP_IMAGES[0]}
                    alt=""
                    width={400}
                    height={300}
                    sizes="(max-width: 640px) 85vw, 400px"
                    className="w-[75%] max-w-[280px] h-auto object-contain"
                    priority
                  />
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-4 mb-1">
                  {t(`home.process.steps.${id}.fullTitle`)}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {t(`home.process.steps.${id}.short`)}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}
