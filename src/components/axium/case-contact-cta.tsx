"use client";

import { Linkedin, Mail, Paperclip, Send } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import contactData from "~/data/contact-cta-data.json";

interface FormData {
  name: string;
  email: string;
  message: string;
  file: File | null;
  budget: string;
  source: string;
}

export function CaseContactCTA() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    file: null,
    budget: "",
    source: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement form submission
    console.log("Form submitted:", formData);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, file });
  };

  const handleBudgetSelect = (value: string) => {
    setFormData({
      ...formData,
      budget: formData.budget === value ? "" : value,
    });
  };

  const handleSourceSelect = (value: string) => {
    setFormData({
      ...formData,
      source: formData.source === value ? "" : value,
    });
  };

  return (
    <section className="w-full py-10 md:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl p-6 md:p-8 lg:p-10 xl:p-12"
          style={{
            background:
              "linear-gradient(135deg, #060C20 0%, #0a1628 50%, #0072CF 100%)",
          }}
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl p-[1px] -z-10">
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, #7ECFC3 0%, #0072CF 50%, #7ECFC3 100%)",
                opacity: 0.3,
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Column - Info */}
            <div className="flex flex-col justify-between lg:w-[40%]">
              <div>
                {/* Title with gradient */}
                <h2
                  className="mb-4 font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[42px] leading-tight"
                  style={{
                    background:
                      "linear-gradient(180deg, #FFFFFF 0%, #B8D4E8 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {contactData.title}
                </h2>

                {/* Steps */}
                <ul className="flex flex-col gap-4 text-sm sm:text-base text-gray-400 max-w-[400px]">
                  {contactData.steps.map((step) => (
                    <li key={step.number} className="leading-relaxed">
                      <span className="text-accent font-semibold">
                        {step.number}.
                      </span>{" "}
                      {step.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CEO Section - Hidden on mobile, shown on md+ */}
              <div className="hidden md:block mt-8">
                <p className="mb-3 text-sm lg:text-base text-white/80">
                  {contactData.ceoSectionTitle}
                </p>
                <div className="relative flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white/5 border border-white/10 max-w-[380px]">
                  <div className="flex items-center gap-3">
                    <Image
                      src={contactData.ceo.image}
                      alt={contactData.ceo.name}
                      width={50}
                      height={50}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm sm:text-base font-bold text-white">
                        {contactData.ceo.name}
                      </span>
                      <span className="text-xs sm:text-sm text-white/60">
                        {contactData.ceo.position}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={contactData.ceo.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-colors duration-300 hover:bg-white/10"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href={`mailto:${contactData.ceo.email}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-colors duration-300 hover:bg-white/10"
                      aria-label="Email"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 lg:flex-1"
              encType="multipart/form-data"
            >
              {/* Name and Email row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group rounded-lg p-[1px] transition-all duration-300 bg-white/10 hover:bg-gradient-to-r hover:from-secondary hover:via-transparent hover:to-accent focus-within:bg-gradient-to-r focus-within:from-secondary focus-within:via-transparent focus-within:to-accent">
                  <input
                    type="text"
                    placeholder={contactData.form.namePlaceholder}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="h-12 md:h-14 w-full rounded-[7px] bg-[#0d1a30] px-4 text-sm md:text-base text-white placeholder:text-gray-500 outline-none"
                    name="name"
                  />
                </div>
                <div className="relative flex-1 group rounded-lg p-[1px] transition-all duration-300 bg-white/10 hover:bg-gradient-to-r hover:from-secondary hover:via-transparent hover:to-accent focus-within:bg-gradient-to-r focus-within:from-secondary focus-within:via-transparent focus-within:to-accent">
                  <input
                    type="email"
                    placeholder={contactData.form.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    autoComplete="email"
                    className="h-12 md:h-14 w-full rounded-[7px] bg-[#0d1a30] px-4 text-sm md:text-base text-white placeholder:text-gray-500 outline-none"
                    name="email"
                  />
                </div>
              </div>

              {/* Message textarea */}
              <div className="relative group rounded-lg p-[1px] transition-all duration-300 bg-white/10 hover:bg-gradient-to-r hover:from-secondary hover:via-transparent hover:to-accent focus-within:bg-gradient-to-r focus-within:from-secondary focus-within:via-transparent focus-within:to-accent">
                <textarea
                  placeholder={contactData.form.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full min-h-[120px] rounded-[7px] bg-[#0d1a30] px-4 py-3 text-sm md:text-base text-white placeholder:text-gray-500 outline-none resize-none"
                  name="message"
                />
              </div>

              {/* File attachment button */}
              <div className="relative group w-fit">
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
                  className="flex h-12 items-center gap-2 rounded-lg bg-secondary px-5 text-sm font-medium text-white transition-all duration-300 hover:bg-accent hover:text-primary"
                >
                  <span>
                    {formData.file
                      ? formData.file.name
                      : contactData.form.attachFileLabel}
                  </span>
                  <Paperclip className="h-4 w-4" />
                </button>
              </div>

              {/* Budget Options */}
              <div className="mt-4 flex flex-col gap-3">
                <p className="text-sm md:text-base text-white/80">
                  {contactData.budgetOptions.title}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {contactData.budgetOptions.options.map((option) => (
                    <li key={option.id}>
                      <button
                        type="button"
                        onClick={() => handleBudgetSelect(option.value)}
                        className={`relative flex h-10 items-center justify-center whitespace-nowrap rounded-lg border px-4 text-sm font-medium transition-all duration-300 ${
                          formData.budget === option.value
                            ? "border-accent bg-accent/20 text-accent"
                            : "border-white/20 bg-white/5 text-white hover:border-accent/50 hover:bg-accent/10"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Source Options */}
              <div className="mt-2 flex flex-col gap-3">
                <p className="text-sm md:text-base text-white/80">
                  {contactData.sourceOptions.title}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {contactData.sourceOptions.options.map((option) => (
                    <li key={option.id}>
                      <button
                        type="button"
                        onClick={() => handleSourceSelect(option.value)}
                        className={`relative flex h-10 items-center justify-center whitespace-nowrap rounded-lg border px-4 text-sm font-medium transition-all duration-300 ${
                          formData.source === option.value
                            ? "border-accent bg-accent/20 text-accent"
                            : "border-white/20 bg-white/5 text-white hover:border-accent/50 hover:bg-accent/10"
                        }`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-12 md:h-14 items-center justify-center gap-2 rounded-lg bg-secondary px-8 text-sm md:text-base font-semibold uppercase text-white transition-all duration-300 hover:bg-accent hover:text-primary disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      {contactData.form.submitLabel}
                      <Send className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* CEO Section - Mobile only */}
            <div className="md:hidden">
              <p className="mb-3 text-sm text-white/80">
                {contactData.ceoSectionTitle}
              </p>
              <div className="relative flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Image
                    src={contactData.ceo.image}
                    alt={contactData.ceo.name}
                    width={50}
                    height={50}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-white">
                      {contactData.ceo.name}
                    </span>
                    <span className="text-xs text-white/60">
                      {contactData.ceo.position}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={contactData.ceo.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-colors duration-300 hover:bg-white/10"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${contactData.ceo.email}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white transition-colors duration-300 hover:bg-white/10"
                    aria-label="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative flare effects */}
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
    </section>
  );
}
