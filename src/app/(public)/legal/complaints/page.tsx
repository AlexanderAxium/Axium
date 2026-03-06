"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function ComplaintsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    documentType: "",
    documentNumber: "",
    complaintType: "",
    subject: "",
    description: "",
    expectedResolution: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success(
      "Reclamo enviado correctamente. Recibirá una respuesta en un plazo máximo de 30 días calendario."
    );
    setIsSubmitting(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      documentType: "",
      documentNumber: "",
      complaintType: "",
      subject: "",
      description: "",
      expectedResolution: "",
    });
  };

  return (
    <div className="container-section py-12 md:py-16">
      <div className="content-section max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <span className="text-overline text-gray-400">Legal</span>
          <h1 className="text-heading-1 text-gray-900 mt-3 mb-2">
            Libro de Reclamaciones
          </h1>
          <p className="text-body text-gray-500 max-w-xl">
            De acuerdo con el Código de Protección y Defensa del Consumidor (Ley
            N.° 29571), Axium S.A.C. pone a su disposición este Libro de
            Reclamaciones virtual para registrar quejas y reclamos.
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Info block */}
          <section className="pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-label font-semibold text-gray-800 mb-1">
                  Reclamos simples
                </p>
                <p className="text-body-sm text-gray-500">
                  Respuesta en hasta 15 días hábiles
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-label font-semibold text-gray-800 mb-1">
                  Reclamos complejos
                </p>
                <p className="text-body-sm text-gray-500">
                  Respuesta en hasta 30 días calendario
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-label font-semibold text-gray-800 mb-1">
                  Confirmación
                </p>
                <p className="text-body-sm text-gray-500">
                  Número de seguimiento por email
                </p>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-6">
              Formulario de reclamo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal data */}
              <div>
                <p className="text-label font-semibold text-gray-700 mb-4">
                  Datos personales
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-body-sm text-gray-700"
                    >
                      Nombre completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-body-sm text-gray-700"
                    >
                      Correo electrónico <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-body-sm text-gray-700"
                    >
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+51 999 999 999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="documentType"
                      className="text-body-sm text-gray-700"
                    >
                      Tipo de documento
                    </Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(v) =>
                        handleInputChange("documentType", v)
                      }
                    >
                      <SelectTrigger id="documentType">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dni">DNI</SelectItem>
                        <SelectItem value="passport">Pasaporte</SelectItem>
                        <SelectItem value="ce">Carné de Extranjería</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label
                      htmlFor="documentNumber"
                      className="text-body-sm text-gray-700"
                    >
                      Número de documento
                    </Label>
                    <Input
                      id="documentNumber"
                      value={formData.documentNumber}
                      onChange={(e) =>
                        handleInputChange("documentNumber", e.target.value)
                      }
                      className="sm:max-w-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Complaint data */}
              <div>
                <p className="text-label font-semibold text-gray-700 mb-4">
                  Datos del reclamo
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="complaintType"
                      className="text-body-sm text-gray-700"
                    >
                      Tipo de reclamo <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.complaintType}
                      onValueChange={(v) =>
                        handleInputChange("complaintType", v)
                      }
                    >
                      <SelectTrigger id="complaintType">
                        <SelectValue placeholder="Seleccionar tipo de reclamo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">
                          Disconformidad con el servicio recibido
                        </SelectItem>
                        <SelectItem value="billing">
                          Problema de facturación o pago
                        </SelectItem>
                        <SelectItem value="delivery">
                          Incumplimiento de plazo de entrega
                        </SelectItem>
                        <SelectItem value="quality">
                          Calidad del entregable
                        </SelectItem>
                        <SelectItem value="support">
                          Atención al cliente
                        </SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-body-sm text-gray-700"
                    >
                      Asunto <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      required
                      placeholder="Resumen breve del reclamo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-body-sm text-gray-700"
                    >
                      Descripción detallada{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={5}
                      required
                      placeholder="Describa su reclamo con el mayor detalle posible: fechas, entregables involucrados y cualquier evidencia relevante."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="expectedResolution"
                      className="text-body-sm text-gray-700"
                    >
                      Resolución esperada
                    </Label>
                    <Textarea
                      id="expectedResolution"
                      value={formData.expectedResolution}
                      onChange={(e) =>
                        handleInputChange("expectedResolution", e.target.value)
                      }
                      rows={3}
                      placeholder="¿Qué solución espera recibir?"
                    />
                  </div>
                </div>
              </div>

              {/* Notice */}
              <p className="text-body-sm text-gray-400 border-l-2 border-gray-200 pl-3">
                Los campos marcados con <span className="text-red-400">*</span>{" "}
                son obligatorios. Su información es tratada con estricta
                confidencialidad conforme a la Ley N.° 29733.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enviando reclamo…" : "Enviar reclamo"}
              </button>
            </form>
          </section>

          {/* Contact info */}
          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-4">
              Contacto directo
            </h2>
            <p className="text-body text-gray-500 mb-5">
              También puede presentar su reclamo directamente por los siguientes
              medios:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-label font-semibold text-gray-700 mb-1">
                  Correo electrónico
                </p>
                <a
                  href="mailto:reclamos@axium.com.pe"
                  className="text-body text-secondary hover:underline"
                >
                  reclamos@axium.com.pe
                </a>
              </div>
              <div>
                <p className="text-label font-semibold text-gray-700 mb-1">
                  Teléfono
                </p>
                <a
                  href="tel:+51991285679"
                  className="text-body text-secondary hover:underline"
                >
                  +51 991 285 679
                </a>
              </div>
              <div>
                <p className="text-label font-semibold text-gray-700 mb-1">
                  Dirección
                </p>
                <p className="text-body text-gray-500">Lima, Perú</p>
              </div>
              <div>
                <p className="text-label font-semibold text-gray-700 mb-1">
                  Horario de atención
                </p>
                <p className="text-body text-gray-500">
                  Lun – Vie, 9:00 – 18:00 (GMT-5)
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
