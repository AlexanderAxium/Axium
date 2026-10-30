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
import { CORREO_RECLAMOS, EMPRESA } from "@/data/empresa";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/** El plazo legal de respuesta (Ley 31435 modificó el art. 24 del Código). Confirmar con Alexander. */
const PLAZO_RESPUESTA = "15 días hábiles";

const AVISO_INDECOPI =
  "La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.";

const FORMULARIO_VACIO = {
  tipo: "",
  name: "",
  email: "",
  phone: "",
  documentType: "",
  documentNumber: "",
  complaintType: "",
  subject: "",
  description: "",
  expectedResolution: "",
};

type Estado =
  | { tipo: "inicial" }
  | { tipo: "enviando" }
  | { tipo: "error"; mensaje: string }
  | {
      tipo: "registrado";
      codigo: string;
      email: string;
      copiaEnviada: boolean;
      hoja: "reclamo" | "queja";
    };

const ERROR_GENERICO = `No pudimos registrar su reclamo. Inténtelo de nuevo en unos minutos o escríbanos a ${CORREO_RECLAMOS}.`;

/** El código de error de /api/libro-reclamaciones → el mensaje para el consumidor. */
const MENSAJES_DE_ERROR: Record<string, string> = {
  datos_invalidos:
    "Revise los campos obligatorios (marcados con *) e inténtelo de nuevo.",
  demasiados_envios:
    "Recibimos varios envíos seguidos desde su conexión. Espere unos minutos e inténtelo de nuevo.",
};

export default function ComplaintsPage() {
  const [formData, setFormData] = useState(FORMULARIO_VACIO);
  const [estado, setEstado] = useState<Estado>({ tipo: "inicial" });
  const isSubmitting = estado.tipo === "enviando";
  const honeypotRef = useRef<HTMLInputElement>(null);
  const constanciaRef = useRef<HTMLDivElement>(null);

  // Al registrar, el foco va a la constancia: la lleva a la vista y el lector de pantalla la lee
  useEffect(() => {
    if (estado.tipo === "registrado") constanciaRef.current?.focus();
  }, [estado.tipo]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const mostrarError = (mensaje: string) => {
    setEstado({ tipo: "error", mensaje });
    toast.error(mensaje);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    // Los Select de Radix no tienen «required» nativo: se valida acá antes de enviar
    if (!formData.complaintType) {
      mostrarError("Seleccione el motivo de su reclamo.");
      return;
    }
    setEstado({ tipo: "enviando" });

    try {
      const res = await fetch("/api/libro-reclamaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          website: honeypotRef.current?.value ?? "",
        }),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        codigo?: string;
        copiaEnviada?: boolean;
      } | null;
      if (res.ok && json?.ok && json.codigo) {
        setEstado({
          tipo: "registrado",
          codigo: json.codigo,
          email: formData.email,
          copiaEnviada: json.copiaEnviada === true,
          hoja: formData.tipo === "queja" ? "queja" : "reclamo",
        });
        setFormData(FORMULARIO_VACIO);
        toast.success(`Registrado con el código ${json.codigo}`);
        return;
      }
      mostrarError(MENSAJES_DE_ERROR[json?.error ?? ""] ?? ERROR_GENERICO);
    } catch {
      mostrarError(ERROR_GENERICO);
    }
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
            N.° 29571), {EMPRESA.razonSocial} (RUC {EMPRESA.ruc}) pone a su
            disposición este Libro de Reclamaciones virtual para registrar
            quejas y reclamos.
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Info block */}
          <section className="pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-label font-semibold text-gray-800 mb-1">
                  Plazo de respuesta
                </p>
                <p className="text-body-sm text-gray-500">
                  Hasta {PLAZO_RESPUESTA}, a su correo
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-label font-semibold text-gray-800 mb-1">
                  Reclamo o queja
                </p>
                <p className="text-body-sm text-gray-500">
                  Reclamo: sobre el servicio. Queja: sobre la atención
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-label font-semibold text-gray-800 mb-1">
                  Constancia
                </p>
                <p className="text-body-sm text-gray-500">
                  Código de registro en pantalla y copia por correo
                </p>
              </div>
            </div>
          </section>

          {/* Form */}
          <section className="py-8">
            <h2 className="text-heading-3 text-gray-900 mb-6">
              Formulario de reclamo
            </h2>

            {estado.tipo === "registrado" ? (
              <div
                ref={constanciaRef}
                tabIndex={-1}
                className="scroll-mt-28 rounded-xl border border-emerald-200 bg-emerald-50 p-6 outline-none"
              >
                <p className="text-label font-semibold text-emerald-900">
                  {estado.hoja === "queja"
                    ? "Queja registrada"
                    : "Reclamo registrado"}
                </p>
                <p className="text-body-sm text-emerald-900 mt-3">
                  Código de registro
                </p>
                <p className="text-heading-3 font-mono tracking-wide text-gray-900 mt-1 select-all">
                  {estado.codigo}
                </p>
                <p className="text-body-sm text-gray-700 mt-4">
                  {estado.copiaEnviada
                    ? `Le enviamos una copia con este código a ${estado.email}. Si no la ve, revise la carpeta de spam.`
                    : `No pudimos enviarle la copia a ${estado.email}, pero ${estado.hoja === "queja" ? "su queja sí quedó registrada" : "su reclamo sí quedó registrado"}. Guarde este código: con él puede consultar el estado escribiendo a ${CORREO_RECLAMOS}.`}
                </p>
                <p className="text-body-sm text-gray-700 mt-2">
                  Le responderemos a ese correo en un plazo máximo de{" "}
                  {PLAZO_RESPUESTA}.
                </p>
                <button
                  type="button"
                  onClick={() => setEstado({ tipo: "inicial" })}
                  className="mt-5 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
                >
                  Registrar otro reclamo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot: fuera de la vista y del tabulador; si llega lleno, es un bot */}
                <div
                  aria-hidden="true"
                  className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
                >
                  <label>
                    Sitio web
                    <input
                      ref={honeypotRef}
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </label>
                </div>

                {/* Reclamo o queja: el formato oficial obliga a elegir */}
                <fieldset>
                  <legend className="text-label font-semibold text-gray-700 mb-4">
                    Tipo de hoja <span className="text-red-500">*</span>
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(
                      [
                        {
                          valor: "reclamo",
                          titulo: "Reclamo",
                          texto:
                            "Disconformidad relacionada con los servicios contratados.",
                        },
                        {
                          valor: "queja",
                          titulo: "Queja",
                          texto:
                            "Malestar o descontento con la atención al público, no relacionado con el servicio.",
                        },
                      ] as const
                    ).map((opcion) => (
                      <label
                        key={opcion.valor}
                        className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors ${
                          formData.tipo === opcion.valor
                            ? "border-secondary bg-secondary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="tipo"
                          value={opcion.valor}
                          checked={formData.tipo === opcion.valor}
                          onChange={() =>
                            handleInputChange("tipo", opcion.valor)
                          }
                          required
                          className="mt-1 accent-[#0072cf]"
                        />
                        <span>
                          <span className="text-body-sm font-semibold text-gray-800 block">
                            {opcion.titulo}
                          </span>
                          <span className="text-body-sm text-gray-500 block">
                            {opcion.texto}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

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
                        Correo electrónico{" "}
                        <span className="text-red-500">*</span>
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
                          <SelectItem value="ce">
                            Carné de Extranjería
                          </SelectItem>
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
                        Motivo <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.complaintType}
                        onValueChange={(v) =>
                          handleInputChange("complaintType", v)
                        }
                      >
                        <SelectTrigger id="complaintType">
                          <SelectValue placeholder="Seleccionar motivo" />
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
                          handleInputChange(
                            "expectedResolution",
                            e.target.value
                          )
                        }
                        rows={3}
                        placeholder="¿Qué solución espera recibir?"
                      />
                    </div>
                  </div>
                </div>

                {/* Notice */}
                <div className="text-body-sm text-gray-400 border-l-2 border-gray-200 pl-3 space-y-2">
                  <p>
                    Los campos marcados con{" "}
                    <span className="text-red-400">*</span> son obligatorios. Su
                    información es tratada con estricta confidencialidad
                    conforme a la Ley N.° 29733.
                  </p>
                  <p>{AVISO_INDECOPI}</p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando reclamo…" : "Enviar reclamo"}
                </button>

                <div aria-live="polite" aria-atomic="true">
                  {estado.tipo === "error" && (
                    <p className="text-body-sm text-red-600">
                      {estado.mensaje}
                    </p>
                  )}
                </div>
              </form>
            )}
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
                  href={`mailto:${CORREO_RECLAMOS}`}
                  className="text-body text-secondary hover:underline"
                >
                  {CORREO_RECLAMOS}
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
                  Domicilio fiscal
                </p>
                <p className="text-body text-gray-500">{EMPRESA.domicilio}</p>
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
