"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const smoothEase = [0.4, 0, 0.2, 1] as const;

/** White background wrapper for all narrative content between hero and carousel. */
export function CaseArticle({ children }: { children: ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: smoothEase }}
      className="bg-white py-20 lg:py-28"
    >
      {children}
    </motion.article>
  );
}

/** Content column matching the site header width. */
export function CaseArticleText({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: smoothEase }}
      className="container-section"
    >
      <div className="content-section">{children}</div>
    </motion.div>
  );
}

/** Wide content column -- same width as CaseArticleText for consistent alignment. */
export function CaseArticleWide({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: smoothEase }}
      className="container-section"
    >
      <div className="content-section">{children}</div>
    </motion.div>
  );
}
