// ============================================================
// Romanian Diacritics Fixer
// ============================================================
// Fixes common Romanian words in cruise titles and destinations
// that were imported without proper diacritics (ă, â, î, ș, ț).
// ============================================================

/**
 * Word-level replacements for Romanian cruise-related text.
 * Format: [pattern, replacement]
 * Uses word boundaries to avoid partial matches.
 */
const REPLACEMENTS: [RegExp, string][] = [
  // --- Common cruise words ---
  [/\bCroaziera\b/g, 'Croazieră'],
  [/\bcroaziera\b/g, 'croazieră'],
  [/\bnopti\b/g, 'nopți'],
  [/\bnoptii\b/g, 'nopții'],

  // --- Destinations ---
  [/\bMediterana\b/g, 'Mediterană'],
  [/\bmediterana\b/g, 'mediterană'],
  [/\bRepozitionari\b/g, 'Repoziționări'],
  [/\brepozitionari\b/g, 'repoziționări'],
  [/\bRepozitionare\b/g, 'Repoziționare'],

  // --- Countries ---
  [/\bFranta\b/g, 'Franța'],
  [/\bRomania\b/g, 'România'],
  [/\bScotia\b/g, 'Scoția'],
  [/\bElvetia\b/g, 'Elveția'],
  [/\bOlanda\b/g, 'Olanda'],  // OK
  [/\bCroatia\b/g, 'Croația'],

  // --- Regions ---
  [/\bOrientul Mijlociu\b/g, 'Orientul Mijlociu'],  // OK
  [/\bOrientul Indepartat\b/g, 'Orientul Îndepărtat'],
  [/\bIndepartat\b/g, 'Îndepărtat'],
  [/\bindepartat\b/g, 'îndepărtat'],

  // --- Romanian "și" (and) ---
  [/\bsi\b/g, 'și'],

  // --- Cities ---
  [/\bCampulung\b/g, 'Câmpulung'],

  // --- Common words ---
  [/\bNoua\b/g, 'Nouă'],
  [/\bnoua\b/g, 'nouă'],
  [/\bTarile\b/g, 'Țările'],
  [/\btarile\b/g, 'țările'],
  [/\bpersoana\b/g, 'persoană'],
  [/\baceasta\b/g, 'această'],
  [/\bgasita\b/g, 'găsită'],
  [/\bNegasita\b/g, 'Negăsită'],
  [/\bAceasta\b/g, 'Această'],
  [/\bExploreaza\b/g, 'Explorează'],
]

/**
 * Fixes Romanian diacritics in a text string.
 * Safe to call on text that already has diacritics — won't double-fix.
 */
export function fixRomanianDiacritics(text: string): string {
  if (!text) return text
  let result = text
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }
  return result
}
