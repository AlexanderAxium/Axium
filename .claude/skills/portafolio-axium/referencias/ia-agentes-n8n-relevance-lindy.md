# Cómo enseñan la IA tres páginas de agentes — n8n, Relevance AI, Lindy

- **Analizadas:** 2026-10-07, para rehacer /servicios/ai-agentic-systems de Axium.
- **Cómo llegó:** Alexander, sobre esa página: *«en vez de poner imágenes y capturas sin
  sentido, ya que no tengo muchos proyectos de automatización, algunos sí, analiza cuáles, y si
  hace falta entonces haz animaciones o genéralo a código o con OpenAI, busca referencias»*.
- **Capturas:** `capturas/ia-agentes/{n8n,relevance,lindy}-full.jpg` (1440, página entera).

## Lo que hacen las tres (y por eso es el suelo, no la firma)
**Enseñan al agente TRABAJANDO, nunca una foto que lo ilustre.** Ninguna usa stock ni
capturas sueltas de otros productos.

| | Pieza principal | Movimiento | Color |
|---|---|---|---|
| **n8n** (ai-agents) | el lienzo de su editor: nodos conectados, el panel de herramientas de un agente | 6 vídeos del editor | lienzo negro, acentos naranja y morado |
| **Relevance AI** | tarjetas con los PASOS del agente («Detailed pre-meeting brief…»), mosaicos de casos con mini-UI, la escalera Assisted → Copilot → Autopilot | sin vídeo; UI estática con estados | lavanda claro |
| **Lindy** | hilos de conversación (tipo Slack) donde el agente contesta y deja constancia de lo que hizo | sin vídeo | blanco con acento violeta |

## Qué se llevó Axium
- Registro + pasos + resultado: el pipeline de Web Scraping AI animado en código con SUS
  mensajes de logging, su modelo y sus tablas (`capturas-clientes/servicios-ia/taller/pipeline.html`).
- La UI real del agente haciendo algo: el asistente de Vendiq armando una tienda (vídeo).
- Si no hay proyecto que lo pruebe, no hay imagen: se anima el sistema real en código, no se
  ilustra con una foto.

## Qué no
El lienzo de nodos de n8n (es SU producto: dibujar uno nuestro sería inventar una UI que no
tenemos), las cifras de clientes que Axium no puede medir.

## Segunda vuelta: qué ofrecen las empresas de software (2026-10-07)
Alexander: *«no te centres en nuestros proyectos, sino en lo que podemos hacer; analiza qué hacen
usualmente las empresas de software para esos servicios»*. Leídas: xyz.dev (Agents & Automation),
Relevant Software (AI agent development), Netguru (llms.txt), South (guía de servicios de IA
generativa), y el blog de HubSpot sobre agentes en LATAM.

| Lo que repiten | Quién |
|---|---|
| Agente de atención (chat, WhatsApp, voz) que responde, consulta, actúa y escala | todas |
| Papeleo y carga de datos: facturas, contratos, formularios → datos | xyz, South, Relevant |
| Asistente sobre el conocimiento de la empresa (RAG, con fuentes) | Netguru, South, Relevant |
| Flujos de varios pasos entre sistemas (CRM, ERP), con humano en el medio | todas |
| Ventas: calificar prospectos y dar seguimiento | Relevant, South |
| IA dentro del producto (copilots, búsqueda, recomendaciones) | Netguru, South |
| Investigación e informes | xyz, Relevant |

**Cómo lo cuentan:** casi todas con texto numerado e iconos, o una miniatura repetida (Relevant
usa la MISMA imagen en sus diez tipos de agente). Nadie enseña al sistema trabajando: ahí está el
hueco que llenan las viñetas en código de Axium. **En LATAM el canal es WhatsApp** (más del 90 %
de los usuarios de internet; HubSpot): por eso la atención va como «por WhatsApp».

**Matiz sobre «el lienzo de nodos de n8n no»:** sigue valiendo para no fingir que tenemos un
producto de nodos. La viñeta de flujos es una ilustración del servicio (pasos genéricos, sin marca
ni cliente), no una captura de UI inventada.
