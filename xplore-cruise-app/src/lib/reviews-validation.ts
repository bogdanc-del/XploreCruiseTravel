import { z } from 'zod'

// ============================================================
// Review validation schema (Zod)
// ============================================================

export const ReviewSubmitSchema = z.object({
  rating: z.number().int().min(1).max(5),
  name: z
    .string()
    .max(100)
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  city: z
    .string()
    .max(100)
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  cruise_type: z
    .string()
    .max(50)
    .optional()
    .nullable()
    .transform((v) => v?.trim() || null),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be under 2000 characters')
    .transform((v) => v.trim()),
  consent_publish: z.literal(true, {
    error: 'Consent to publish is required',
  }),
  // Honeypot field — must be empty
  website: z
    .string()
    .max(0, 'Invalid submission')
    .optional()
    .default(''),
})

export type ReviewSubmitInput = z.infer<typeof ReviewSubmitSchema>

export interface Review {
  id: string
  rating: number
  name: string | null
  city: string | null
  cruise_type: string | null
  message: string
  consent_publish: boolean
  approved: boolean
  source: 'qr' | 'direct' | 'manual'
  created_at: string
}
