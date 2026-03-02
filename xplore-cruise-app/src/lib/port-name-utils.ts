// ============================================================
// Port Name Utilities — shared name normalization & matching
// Used by RouteMap (coordinate lookup) and ports.ts (info lookup)
// ============================================================

/** Result of extracting a city name from a raw API port name */
export interface ParsedPortName {
  /** Full raw name, trimmed */
  raw: string
  /** City name only (before comma, without parenthetical) */
  city: string
  /** Lowercased city for comparison */
  cityLower: string
  /** Individual parts when name contains "/" separator */
  slashParts: string[]
  /** Parenthetical content if present, e.g. "Livorno" from "Pisa (Livorno)" */
  parenthetical: string | null
}

/**
 * Parse a raw API port name into structured components.
 *
 * Handles formats like:
 *   "Marseille, Franta"           → city: "Marseille"
 *   "Roma (Civitavecchia), Italia" → city: "Roma", parenthetical: "Civitavecchia"
 *   "Florenta / Pisa (Livorno)"   → slashParts: ["Florenta", "Pisa (Livorno)"]
 */
export function parsePortName(rawName: string): ParsedPortName {
  const raw = rawName.trim()
  const city = raw.replace(/,.*$/, '').replace(/\s*\(.*\)/, '').trim()
  const parenMatch = raw.match(/\(([^)]+)\)/)

  return {
    raw,
    city,
    cityLower: city.toLowerCase(),
    slashParts: city.split('/').map(s => s.trim()),
    parenthetical: parenMatch ? parenMatch[1].trim() : null,
  }
}

/**
 * Multi-strategy lookup against a keyed record.
 *
 * Tries in order:
 *   1. Exact match on raw name
 *   2. Match on extracted city name
 *   3. Match via aliases map
 *   4. Slash-part matching (each part, plus parenthetical within)
 *   5. Case-insensitive match
 *   6. Case-insensitive alias match
 *
 * @param parsed   - Pre-parsed port name (from `parsePortName`)
 * @param data     - Record to look up keys in
 * @param aliases  - Optional alias map (alias → data key)
 * @returns The matched key, or null if nothing matched
 */
export function fuzzyMatchPort<T>(
  parsed: ParsedPortName,
  data: Record<string, T>,
  aliases: Record<string, string> = {},
): string | null {
  // 1. Exact match on raw name
  if (data[parsed.raw]) return parsed.raw

  // 2. Match on extracted city name
  if (data[parsed.city]) return parsed.city

  // 3. Direct alias lookup
  const aliasTarget = aliases[parsed.city]
  if (aliasTarget && data[aliasTarget]) return aliasTarget

  // 4. Slash-part matching (handles "Florenta / Pisa (Livorno)")
  for (const part of parsed.slashParts) {
    const clean = part.replace(/\s*\(.*\)/, '').trim()
    if (data[clean]) return clean
    if (aliases[clean] && data[aliases[clean]]) return aliases[clean]

    // Check parenthetical within slash-part
    const parenMatch = part.match(/\(([^)]+)\)/)
    if (parenMatch) {
      const pName = parenMatch[1].trim()
      if (data[pName]) return pName
      if (aliases[pName] && data[aliases[pName]]) return aliases[pName]
    }
  }

  // 5. Case-insensitive match against data keys
  for (const key of Object.keys(data)) {
    if (key.toLowerCase() === parsed.cityLower) return key
  }

  // 6. Case-insensitive alias match
  for (const [alias, target] of Object.entries(aliases)) {
    if (alias.toLowerCase() === parsed.cityLower && data[target]) return target
  }

  return null
}
