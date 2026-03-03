// ============================================================
// Email Notification Service
//
// Sends email notifications for new leads, contacts, and reviews
// to xplorecruisetravel@gmail.com via SMTP (Nodemailer).
//
// Configuration (env vars):
//   SMTP_HOST     — SMTP server host (default: smtp.gmail.com)
//   SMTP_PORT     — SMTP server port (default: 587)
//   SMTP_USER     — SMTP username (email address)
//   SMTP_PASS     — SMTP password (Gmail App Password)
//   NOTIFICATION_EMAIL — recipient email (default: xplorecruisetravel@gmail.com)
//
// Falls back gracefully if SMTP is not configured (logs only).
// ============================================================

import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'xplorecruisetravel@gmail.com'

// Lazy-initialized transporter (singleton)
let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_USER || !SMTP_PASS) {
    return null
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  }

  return transporter
}

/**
 * Check if email notifications are configured
 */
export function isEmailConfigured(): boolean {
  return !!(SMTP_USER && SMTP_PASS)
}

/**
 * Send a generic email notification.
 * Returns true on success, false on failure (never throws).
 */
async function sendEmail(
  subject: string,
  html: string,
  to?: string,
): Promise<boolean> {
  const transport = getTransporter()
  if (!transport) {
    console.log('[EMAIL] SMTP not configured — notification skipped')
    return false
  }

  try {
    await transport.sendMail({
      from: `"XploreCruiseTravel" <${SMTP_USER}>`,
      to: to || NOTIFICATION_EMAIL,
      subject,
      html,
    })
    console.log(`[EMAIL] Notification sent: ${subject}`)
    return true
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[EMAIL] Failed to send: ${msg}`)
    return false
  }
}

// ============================================================
// Notification Templates
// ============================================================

interface LeadNotificationData {
  name: string
  email: string
  phone?: string
  message: string
  cruiseTitle?: string
  cruiseSlug?: string
  cruisePrice?: number
  source?: string
  guidedContext?: Record<string, unknown> | null
}

/**
 * Send notification for a new lead / offer request.
 */
export async function notifyNewLead(data: LeadNotificationData): Promise<boolean> {
  const { name, email, phone, message, cruiseTitle, cruiseSlug, cruisePrice, source, guidedContext } = data

  const cruiseInfo = cruiseTitle
    ? `
      <tr><td style="padding:4px 8px;font-weight:bold">Croaziera:</td><td style="padding:4px 8px">${cruiseTitle}</td></tr>
      ${cruiseSlug ? `<tr><td style="padding:4px 8px;font-weight:bold">Link:</td><td style="padding:4px 8px"><a href="https://xplorecruisetravel.com/cruises/${cruiseSlug}">Vezi croaziera</a></td></tr>` : ''}
      ${cruisePrice ? `<tr><td style="padding:4px 8px;font-weight:bold">Pret de la:</td><td style="padding:4px 8px">${cruisePrice} EUR</td></tr>` : ''}
    `
    : ''

  const guidedInfo = guidedContext
    ? `
      <h3 style="color:#1E3A5F;margin-top:16px">Context Ghid Recomandare</h3>
      <table style="border-collapse:collapse;width:100%">
        ${Object.entries(guidedContext).map(([k, v]) =>
          v != null ? `<tr><td style="padding:4px 8px;font-weight:bold">${k}:</td><td style="padding:4px 8px">${v}</td></tr>` : ''
        ).join('')}
      </table>
    `
    : ''

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0B1426;color:#D4A853;padding:16px 24px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">Cerere Noua de Oferta</h2>
      </div>
      <div style="background:#f9f9f9;padding:24px;border:1px solid #ddd;border-radius:0 0 8px 8px">
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:4px 8px;font-weight:bold">Nume:</td><td style="padding:4px 8px">${name}</td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold">Email:</td><td style="padding:4px 8px"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:4px 8px;font-weight:bold">Telefon:</td><td style="padding:4px 8px"><a href="tel:${phone}">${phone}</a></td></tr>` : ''}
          <tr><td style="padding:4px 8px;font-weight:bold">Sursa:</td><td style="padding:4px 8px">${source || 'website'}</td></tr>
          ${cruiseInfo}
        </table>
        <h3 style="color:#1E3A5F;margin-top:16px">Mesaj</h3>
        <p style="background:white;padding:12px;border-radius:4px;border:1px solid #eee">${message.replace(/\n/g, '<br>')}</p>
        ${guidedInfo}
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0">
        <p style="font-size:12px;color:#888">
          Trimis automat de XploreCruiseTravel la ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
        </p>
      </div>
    </div>
  `

  return sendEmail(
    `[XploreCruise] Cerere noua: ${name}${cruiseTitle ? ` — ${cruiseTitle}` : ''}`,
    html,
  )
}

interface ContactNotificationData {
  name: string
  email: string
  phone?: string
  message: string
}

/**
 * Send notification for a new contact form message.
 */
export async function notifyNewContact(data: ContactNotificationData): Promise<boolean> {
  const { name, email, phone, message } = data

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0B1426;color:#D4A853;padding:16px 24px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">Mesaj Nou — Formular Contact</h2>
      </div>
      <div style="background:#f9f9f9;padding:24px;border:1px solid #ddd;border-radius:0 0 8px 8px">
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:4px 8px;font-weight:bold">Nume:</td><td style="padding:4px 8px">${name}</td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold">Email:</td><td style="padding:4px 8px"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:4px 8px;font-weight:bold">Telefon:</td><td style="padding:4px 8px"><a href="tel:${phone}">${phone}</a></td></tr>` : ''}
        </table>
        <h3 style="color:#1E3A5F;margin-top:16px">Mesaj</h3>
        <p style="background:white;padding:12px;border-radius:4px;border:1px solid #eee">${message.replace(/\n/g, '<br>')}</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0">
        <p style="font-size:12px;color:#888">
          Trimis automat de XploreCruiseTravel la ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
        </p>
      </div>
    </div>
  `

  return sendEmail(`[XploreCruise] Mesaj contact: ${name}`, html)
}

interface ReviewNotificationData {
  name: string
  rating: number
  message: string
  city?: string
  cruiseType?: string
}

/**
 * Send notification for a new review submission.
 */
export async function notifyNewReview(data: ReviewNotificationData): Promise<boolean> {
  const { name, rating, message, city, cruiseType } = data
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0B1426;color:#D4A853;padding:16px 24px;border-radius:8px 8px 0 0">
        <h2 style="margin:0">Recenzie Noua — Asteapta Aprobare</h2>
      </div>
      <div style="background:#f9f9f9;padding:24px;border:1px solid #ddd;border-radius:0 0 8px 8px">
        <table style="border-collapse:collapse;width:100%">
          <tr><td style="padding:4px 8px;font-weight:bold">Nume:</td><td style="padding:4px 8px">${name}</td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold">Rating:</td><td style="padding:4px 8px;color:#D4A853;font-size:18px">${stars} (${rating}/5)</td></tr>
          ${city ? `<tr><td style="padding:4px 8px;font-weight:bold">Oras:</td><td style="padding:4px 8px">${city}</td></tr>` : ''}
          ${cruiseType ? `<tr><td style="padding:4px 8px;font-weight:bold">Tip croaziera:</td><td style="padding:4px 8px">${cruiseType}</td></tr>` : ''}
        </table>
        <h3 style="color:#1E3A5F;margin-top:16px">Recenzie</h3>
        <p style="background:white;padding:12px;border-radius:4px;border:1px solid #eee">${message.replace(/\n/g, '<br>')}</p>
        <p style="margin-top:16px">
          <a href="https://xplorecruisetravel.com/admin" style="display:inline-block;background:#D4A853;color:#0B1426;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:bold">
            Aproba/Respinge in Admin
          </a>
        </p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0">
        <p style="font-size:12px;color:#888">
          Trimis automat de XploreCruiseTravel la ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
        </p>
      </div>
    </div>
  `

  return sendEmail(`[XploreCruise] Recenzie noua: ${stars} de la ${name}`, html)
}
