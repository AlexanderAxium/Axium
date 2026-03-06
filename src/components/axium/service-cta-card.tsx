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
    <div className="rounded-2xl overflow-hidden bg-gray-100 flex flex-col justify-between p-6 sm:p-8 min-h-[320px] lg:min-h-[280px]">
      <div className="flex flex-col gap-2 sm:gap-3 flex-1">
        <p className="text-gray-900 text-lg sm:text-xl leading-snug font-medium">
          {title}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <button
        type="button"
        onClick={handleWhatsApp}
        className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:scale-[1.02] w-fit mt-6 shrink-0"
      >
        <MessageCircle className="h-4 w-4" />
        Hablemos por WhatsApp
      </button>
    </div>
  );
}
