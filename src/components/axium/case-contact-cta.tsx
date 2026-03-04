"use client";

import { Linkedin, Mail, Paperclip, Send } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import contactData from "~/data/contact-cta-data.json";
import { useTranslation } from "~/hooks/useTranslation";

const smoothEase = [0.4, 0, 0.2, 1] as const;

const SOURCE_OPTIONS = [
  { id: "source-1", key: "sourceGoogle", value: "google" },
  { id: "source-2", key: "sourceLinkedIn", value: "linkedin" },
  { id: "source-3", key: "sourceReferral", value: "referral" },
  { id: "source-4", key: "sourceSocial", value: "social" },
  { id: "source-5", key: "sourceOther", value: "other" },
] as const;

interface FormData {
  name: string;
  email: string;
  message: string;
  file: File | null;
  source: string;
}

export function CaseContactCTA() {
  const { t } = useTranslation("landing");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    file: null,
    source: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Form submitted:", formData);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, file });
  };

  const handleSourceSelect = (value: string) => {
    setFormData({
      ...formData,
      source: formData.source === value ? "" : value,
    });
  };

  return (
    <section id="contacto" className="w-full py-10 md:py-14 lg:py-20 bg-white">
      <div className="container-section">
        <div className="content-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl p-6 md:p-8 lg:p-10 xl:p-12 bg-cover bg-center"
            style={{
              backgroundImage: "url('/abs1.jpg')",
            }}
          >
            {/* Overlay gradiente: oscuro a la izquierda, casi transparente a la derecha */}
            <div
              className="absolute inset-0 z-[1] rounded-2xl"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)",
              }}
              aria-hidden
            />

            <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
              <div className="flex flex-col justify-between lg:w-[40%]">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1, ease: smoothEase }}
                    className="text-heading-1 mb-4"
                    style={{
                      background:
                        "linear-gradient(180deg, #FFFFFF 0%, #B8D4E8 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {t("home.contactCta.title")}
                  </motion.h2>

                  <motion.ul
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2, ease: smoothEase }}
                    className="flex flex-col gap-3 text-body-sm text-gray-400 max-w-[400px]"
                  >
                    <li className="leading-relaxed">
                      <span className="text-accent font-semibold">1.</span>{" "}
                      {t("home.contactCta.step1")}
                    </li>
                    <li className="leading-relaxed">
                      <span className="text-accent font-semibold">2.</span>{" "}
                      {t("home.contactCta.step2")}
                    </li>
                  </motion.ul>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, ease: smoothEase }}
                  className="hidden md:block mt-8"
                >
                  <p className="text-body-sm mb-3 text-white/80">
                    {t("home.contactCta.ceoSectionTitle")}
                  </p>
                  <div className="relative flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 max-w-[380px]">
                    <div className="flex items-center gap-3">
                      <Image
                        src={contactData.ceo.image}
                        alt={contactData.ceo.name}
                        width={50}
                        height={50}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-body font-bold text-white">
                          {contactData.ceo.name}
                        </span>
                        <span className="text-body-sm text-white/60">
                          {t("home.contactCta.ceoPosition")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Red social LinkedIn - comentado por ahora */}
                      {/* <a
                        href={contactData.ceo.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-colors duration-300 hover:bg-white/10"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                      </a> */}
                      <a
                        href={`mailto:${contactData.ceo.email}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-colors duration-300 hover:bg-white/10"
                        aria-label="Email"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3.5 lg:flex-1"
                encType="multipart/form-data"
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2, ease: smoothEase }}
                  className="flex flex-col sm:flex-row gap-3.5"
                >
                  <div className="relative flex-1 group rounded-lg p-[1px] transition-all duration-300 bg-white/10 hover:bg-gradient-to-r hover:from-secondary hover:via-transparent hover:to-accent focus-within:bg-gradient-to-r focus-within:from-secondary focus-within:via-transparent focus-within:to-accent">
                    <input
                      type="text"
                      placeholder={t("home.contactCta.form.namePlaceholder")}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="text-body h-11 md:h-12 w-full rounded-[7px] bg-[#0d1a30] px-4 text-white placeholder:text-gray-500 outline-none"
                      name="name"
                    />
                  </div>
                  <div className="relative flex-1 group rounded-lg p-[1px] transition-all duration-300 bg-white/10 hover:bg-gradient-to-r hover:from-secondary hover:via-transparent hover:to-accent focus-within:bg-gradient-to-r focus-within:from-secondary focus-within:via-transparent focus-within:to-accent">
                    <input
                      type="email"
                      placeholder={t("home.contactCta.form.emailPlaceholder")}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      autoComplete="email"
                      className="text-body h-11 md:h-12 w-full rounded-[7px] bg-[#0d1a30] px-4 text-white placeholder:text-gray-500 outline-none"
                      name="email"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3, ease: smoothEase }}
                  className="relative group rounded-lg p-[1px] transition-all duration-300 bg-white/10 hover:bg-gradient-to-r hover:from-secondary hover:via-transparent hover:to-accent focus-within:bg-gradient-to-r focus-within:from-secondary focus-within:via-transparent focus-within:to-accent"
                >
                  <textarea
                    placeholder={t("home.contactCta.form.messagePlaceholder")}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={4}
                    className="text-body w-full min-h-[110px] rounded-[7px] bg-[#0d1a30] px-4 py-3 text-white placeholder:text-gray-500 outline-none resize-none"
                    name="message"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4, ease: smoothEase }}
                  className="relative group w-fit"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg"
                    name="file"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-body-sm flex h-10 items-center gap-2 rounded-lg bg-secondary px-4 font-medium text-white transition-all duration-300 hover:bg-accent hover:text-primary"
                  >
                    <span>
                      {formData.file
                        ? formData.file.name
                        : t("home.contactCta.form.attachFileLabel")}
                    </span>
                    <Paperclip className="h-3.5 w-3.5" />
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5, ease: smoothEase }}
                  className="mt-1 flex flex-col gap-2.5"
                >
                  <p className="text-body-sm text-white/80">
                    {t("home.contactCta.sourceTitle")}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {SOURCE_OPTIONS.map((option) => (
                      <li key={option.id}>
                        <button
                          type="button"
                          onClick={() => handleSourceSelect(option.value)}
                          className={`text-pill relative flex h-9 items-center justify-center whitespace-nowrap rounded-lg border px-3.5 font-medium transition-all duration-300 ${
                            formData.source === option.value
                              ? "border-accent bg-accent/20 text-accent"
                              : "border-white/20 bg-white/5 text-white hover:border-accent/50 hover:bg-accent/10"
                          }`}
                        >
                          {t(`home.contactCta.${option.key}`)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6, ease: smoothEase }}
                  className="mt-4"
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-body-sm group flex h-11 md:h-12 items-center justify-center gap-2 rounded-lg bg-secondary px-7 font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:bg-accent hover:text-primary disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      t("home.contactCta.form.submitting")
                    ) : (
                      <>
                        {t("home.contactCta.form.submitLabel")}
                        <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: smoothEase }}
                className="md:hidden"
              >
                <p className="text-body-sm mb-3 text-white/80">
                  {t("home.contactCta.ceoSectionTitle")}
                </p>
                <div className="relative flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <Image
                      src={contactData.ceo.image}
                      alt={contactData.ceo.name}
                      width={50}
                      height={50}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-body font-bold text-white">
                        {contactData.ceo.name}
                      </span>
                      <span className="text-body-sm text-white/60">
                        {t("home.contactCta.ceoPosition")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Red social LinkedIn - comentado por ahora */}
                    {/* <a
                      href={contactData.ceo.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-colors duration-300 hover:bg-white/10"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a> */}
                    <a
                      href={`mailto:${contactData.ceo.email}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-colors duration-300 hover:bg-white/10"
                      aria-label="Email"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            <div
              className="pointer-events-none absolute -z-0 w-64 h-64 top-0 left-[10%] opacity-10 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #ffffff 0%, transparent 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute -z-0 w-96 h-96 bottom-0 left-[5%] opacity-10 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #0072CF 0%, transparent 70%)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
