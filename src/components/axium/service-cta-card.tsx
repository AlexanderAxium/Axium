"use client";

import { MessageCircle } from "lucide-react";

interface ServiceCtaCardProps {
  title?: string;
  subtitle?: string;
  whatsappMessage: string;
}

export function ServiceCtaCard({
  title = "¿Listo para empezar?",
  subtitle = "Conversemos sobre tu proyecto. Sin compromiso, sin presión.",
  whatsappMessage,
}: ServiceCtaCardProps) {
  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/51991285679?text=${encoded}`, "_blank");
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden min-h-[420px] flex flex-col justify-between p-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/abs7.jpg')" }}
    >
      {/* subtle overlay to ensure legibility */}
      <div className="absolute inset-0 bg-white/30" aria-hidden />

      <div className="relative z-10 flex flex-col gap-5 h-full justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-gray-900 text-xl leading-snug">{title}</p>
          <p className="text-gray-600 text-sm leading-relaxed">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:scale-[1.02] w-fit"
        >
          <MessageCircle className="h-4 w-4" />
          Hablemos por WhatsApp
        </button>
      </div>
    </div>
  );
}
