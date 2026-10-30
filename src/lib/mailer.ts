import "dotenv/config";

import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_SMTP,
  port: Number(process.env.NODEMAILER_PORT) || 587,
  secure: Number(process.env.NODEMAILER_PORT) === 465,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
  // Sin esto, un SMTP caído deja colgado el envío del formulario hasta 2 minutos (los valores
  // por defecto de nodemailer) y el visitante cree que la web se trabó
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 30_000,
});

/** Las variables sin las que no sale ningún correo. Solo los nombres: nunca se imprime el valor. */
const MAILER_ENV_REQUERIDAS = [
  "NODEMAILER_SMTP",
  "NODEMAILER_USER",
  "NODEMAILER_PASSWORD",
] as const;

/** Las que faltan en este proceso; vacío = el mailer está configurado. */
export const mailerEnvFaltantes = (): string[] =>
  MAILER_ENV_REQUERIDAS.filter((nombre) => !process.env[nombre]?.trim());

/**
 * El remitente. NODEMAILER_FROM es opcional: hace falta cuando el usuario SMTP no es una
 * dirección (el relay SMTP de SendGrid usa «apikey»); si no está, sale desde NODEMAILER_USER.
 */
const remitente = () =>
  process.env.NODEMAILER_FROM || process.env.NODEMAILER_USER;

export class MailerNoConfiguradoError extends Error {
  constructor(public readonly faltan: string[]) {
    super(`Mailer sin configurar: faltan ${faltan.join(", ")}`);
    this.name = "MailerNoConfiguradoError";
  }
}

export interface CorreoOpciones {
  to: Mail.Options["to"];
  subject: string;
  html: string;
  text: string;
  replyTo?: Mail.Options["replyTo"];
  attachments?: Mail.Attachment[];
}

/**
 * Envío con responder-a y adjuntos, para los formularios públicos. Falla de forma explícita
 * (MailerNoConfiguradoError) si faltan variables, en vez de intentar un SMTP en localhost.
 */
export const enviarCorreo = async (opciones: CorreoOpciones) => {
  const faltan = mailerEnvFaltantes();
  if (faltan.length > 0) throw new MailerNoConfiguradoError(faltan);
  return await transporter.sendMail({ from: remitente(), ...opciones });
};

export const sendMail = async (
  to: string,
  subject: string,
  content: string
) => {
  const isHtml = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(content);
  return await transporter.sendMail({
    from: remitente(),
    to,
    subject,
    ...(isHtml ? { html: content } : { text: content }),
  });
};

export const sendVerificationEmail = async (email: string, url: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirma tu cuenta</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #2563eb;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin: 0;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: #2563eb;
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .button:hover {
          background: #1d4ed8;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .warning {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🚀 Tu App</div>
          <h1 class="title">Confirma tu cuenta</h1>
        </div>
        
        <div class="content">
          <p>¡Hola! 👋</p>
          <p>Gracias por registrarte en nuestra plataforma. Para completar tu registro y activar tu cuenta, necesitas confirmar tu dirección de email.</p>
          
          <p>Haz clic en el botón de abajo para verificar tu cuenta:</p>
          
          <div style="text-align: center;">
            <a href="${url}" class="button">✅ Confirmar mi cuenta</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong> Este enlace expirará en 24 horas por seguridad.
          </div>
          
          <p>Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">${url}</p>
        </div>
        
        <div class="footer">
          <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
          <p>© 2024 Tu App. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail(
    email,
    "Confirma tu cuenta - Verificación de email",
    htmlContent
  );
};

export const sendResetPasswordEmail = async (email: string, url: string) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Restablece tu contraseña</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #dc2626;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #1f2937;
          margin: 0;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: #dc2626;
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          margin: 20px 0;
        }
        .button:hover {
          background: #b91c1c;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        .warning {
          background: #fef2f2;
          border: 1px solid #fca5a5;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          color: #dc2626;
        }
        .security-tips {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 6px;
          padding: 16px;
          margin: 20px 0;
          color: #0c4a6e;
        }
        .security-tips h3 {
          margin-top: 0;
          color: #0c4a6e;
        }
        .security-tips ul {
          margin: 10px 0;
          padding-left: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔐 Tu App</div>
          <h1 class="title">Restablece tu contraseña</h1>
        </div>
        
        <div class="content">
          <p>¡Hola! 👋</p>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú quien hizo esta solicitud, haz clic en el botón de abajo para crear una nueva contraseña.</p>
          
          <div style="text-align: center;">
            <a href="${url}" class="button">🔑 Restablecer contraseña</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong> Este enlace expirará en 1 hora por seguridad. Si no restableces tu contraseña en este tiempo, deberás solicitar uno nuevo.
          </div>
          
          <div class="security-tips">
            <h3>🛡️ Consejos de seguridad:</h3>
            <ul>
              <li>Usa una contraseña única y segura</li>
              <li>Combina letras, números y símbolos</li>
              <li>No uses información personal fácil de adivinar</li>
              <li>Considera usar un gestor de contraseñas</li>
            </ul>
          </div>
          
          <p>Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:</p>
          <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-family: monospace;">${url}</p>
        </div>
        
        <div class="footer">
          <p><strong>¿No solicitaste este cambio?</strong></p>
          <p>Si no fuiste tú quien solicitó restablecer la contraseña, puedes ignorar este email. Tu cuenta permanecerá segura.</p>
          <p>© 2024 Tu App. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail(
    email,
    "Restablece tu contraseña - Solicitud de cambio",
    htmlContent
  );
};
