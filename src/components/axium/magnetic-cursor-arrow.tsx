"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { type ReactNode, useId, useRef, useState } from "react";

const ARROW_SIZE = 100;
const springCfg = { stiffness: 380, damping: 28, mass: 0.6 };

export function MagneticCursorArrow({
  children,
  label,
  className = "",
  arrowColor = "text-[#000000]",
}: {
  children: ReactNode;
  label: string;
  className?: string;
  arrowColor?: string;
}) {
  const id = useId().replace(/:/g, "-");
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const x = useSpring(rawX, springCfg);
  const y = useSpring(rawY, springCfg);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    rawX.set(e.clientX - rect.left - ARROW_SIZE / 2);
    rawY.set(e.clientY - rect.top - ARROW_SIZE / 2);
  }

  function onMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = e.clientX - rect.left - ARROW_SIZE / 2;
    const ny = e.clientY - rect.top - ARROW_SIZE / 2;
    rawX.jump(nx);
    rawY.jump(ny);
    x.jump(nx);
    y.jump(ny);
    setHovered(true);
  }

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* Cursor-following glass arrow */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none z-20"
        style={{ x, y, width: ARROW_SIZE, height: ARROW_SIZE }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.4 }}
        transition={{
          opacity: { duration: 0.16 },
          scale: { type: "spring", stiffness: 500, damping: 28 },
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        />
        <motion.svg
          viewBox="0 0 88 88"
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label="Circular view project indicator"
          animate={hovered ? { rotate: 360 } : { rotate: 0 }}
          transition={
            hovered
              ? {
                  duration: 9,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }
              : { duration: 0.3 }
          }
        >
          <defs>
            <path
              id={`circ-${id}`}
              d="M 44,44 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
            />
          </defs>
          <text
            style={{
              fontSize: "7.2px",
              letterSpacing: "0.18em",
              fill: "rgba(0,0,0,0.45)",
              fontWeight: 500,
              fontFamily: "inherit",
            }}
          >
            <textPath href={`#circ-${id}`} startOffset="0%">
              {label}
            </textPath>
          </text>
        </motion.svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <ArrowUpRight className={`w-7 h-7 ${arrowColor}`} strokeWidth={2} />
        </div>
      </motion.div>
    </div>
  );
}
