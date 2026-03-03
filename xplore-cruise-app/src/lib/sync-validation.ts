// ============================================================
// sync-validation.ts — Zod schemas for croaziere.net API responses
//
// Used by /api/sync/prices to validate external data.
// Invalid items are rejected individually, not the whole batch.
// ============================================================

import { z } from 'zod'

// Schema for a single cruise from the API response
export const ApiCruiseSchema = z.object({
  id: z.union([z.number(), z.string()]).transform(String),
  name: z.string().optional(),
  price: z.union([z.number(), z.string()]).optional().transform(val => {
    if (val === undefined || val === null || val === '') return 0
    const num = Number(val)
    return isNaN(num) ? 0 : num
  }),
  currency: z.string().optional(),
  is_promo: z.union([z.number(), z.string()]).optional(),
  price_promo: z.union([z.number(), z.string()]).optional(),
  is_bestdeal: z.union([z.number(), z.string()]).optional(),
  images: z.array(z.string()).optional().default([]),
  departures: z.array(z.string()).optional().default([]),
  rooms: z.array(z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    date: z.string().optional(),
    price: z.union([z.number(), z.string()]).optional(),
  })).optional().default([]),
  itinerary: z.array(z.object({
    id: z.number().optional(),
    name: z.string().optional(),
    day: z.number().optional(),
    from_hour: z.string().optional(),
    till_hour: z.string().optional(),
  })).optional().default([]),
}).passthrough() // Allow extra fields without failing

// Schema for the full API response
export const ApiResponseSchema = z.object({
  response: z.object({
    cruises: z.array(z.unknown()).optional().default([]),
  }).optional(),
  cruises: z.array(z.unknown()).optional(),
}).passthrough()

// Type inferred from the schema
export type ValidatedApiCruise = z.infer<typeof ApiCruiseSchema>

/**
 * Validate a batch of cruise objects from the API.
 * Returns valid items + count of rejected items.
 * Never throws — invalid items are skipped.
 */
export function validateBatch(rawCruises: unknown[]): {
  valid: ValidatedApiCruise[]
  rejected: number
  errors: string[]
} {
  const valid: ValidatedApiCruise[] = []
  const errors: string[] = []
  let rejected = 0

  for (const raw of rawCruises) {
    const result = ApiCruiseSchema.safeParse(raw)
    if (result.success) {
      valid.push(result.data)
    } else {
      rejected++
      // Log first error only (don't leak full payload)
      const firstError = result.error.issues[0]
      if (firstError) {
        const id = typeof raw === 'object' && raw !== null && 'id' in raw
          ? String((raw as Record<string, unknown>).id)
          : 'unknown'
        errors.push(`Cruise ${id}: ${firstError.path.join('.')} — ${firstError.message}`)
      }
    }
  }

  return { valid, rejected, errors }
}

/**
 * Parse the top-level API response and extract the cruises array.
 * Handles both { response: { cruises: [...] } } and { cruises: [...] }.
 */
export function parseApiResponse(data: unknown): unknown[] {
  if (!data || typeof data !== 'object') return []

  const obj = data as Record<string, unknown>

  // Try nested format first: { response: { cruises: [...] } }
  if (obj.response && typeof obj.response === 'object') {
    const resp = obj.response as Record<string, unknown>
    if (Array.isArray(resp.cruises)) return resp.cruises
  }

  // Flat format: { cruises: [...] }
  if (Array.isArray(obj.cruises)) return obj.cruises

  return []
}
