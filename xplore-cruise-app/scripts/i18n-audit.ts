/**
 * Phase 3 — i18n audit script
 * Compares translation keys across EN and RO, detects placeholders, diacritics issues
 * Run: npx tsx scripts/i18n-audit.ts
 */

import { translations } from '../src/i18n/translations'

let exitCode = 0

// ── 1. Missing keys ──────────────────────────────────────────────────
const enKeys = Object.keys(translations.en) as (keyof typeof translations.en)[]
const roKeys = Object.keys(translations.ro) as (keyof typeof translations.ro)[]

const missingInRo = enKeys.filter((k) => !(k in translations.ro))
const missingInEn = roKeys.filter((k) => !(k in translations.en))

if (missingInRo.length > 0) {
  console.error(`\n❌ Keys present in EN but MISSING in RO (${missingInRo.length}):`)
  missingInRo.forEach((k) => console.error(`   - ${k}`))
  exitCode = 1
}

if (missingInEn.length > 0) {
  console.error(`\n❌ Keys present in RO but MISSING in EN (${missingInEn.length}):`)
  missingInEn.forEach((k) => console.error(`   - ${k}`))
  exitCode = 1
}

if (missingInRo.length === 0 && missingInEn.length === 0) {
  console.log('✅ All translation keys are present in both EN and RO')
}

// ── 2. Placeholder detection (lorem, TODO, TBD, coming soon) ────────
const placeholderPatterns = /\b(lorem|ipsum|TODO|TBD|FIXME|coming soon|placeholder|xxx|test123)\b/gi

for (const locale of ['en', 'ro'] as const) {
  const keys = Object.keys(translations[locale]) as (keyof typeof translations[typeof locale])[]
  for (const key of keys) {
    const value = translations[locale][key]
    if (placeholderPatterns.test(value)) {
      console.error(`\n⚠️  Placeholder detected in ${locale}.${key}: "${value}"`)
      exitCode = 1
    }
    // Reset regex lastIndex
    placeholderPatterns.lastIndex = 0
  }
}

console.log('\n✅ Placeholder check complete')

// ── 3. Romanian diacritics consistency ──────────────────────────────
// Romanian should use: ă, â, î, ș, ț (not ş, ţ with cedilla)
// But the translations use ASCII equivalents — flag any cedilla forms
const cedillaPattern = /[şţŞŢ]/g
for (const key of roKeys) {
  const value = translations.ro[key]
  const matches = value.match(cedillaPattern)
  if (matches) {
    console.warn(`⚠️  Cedilla characters in ro.${key}: "${matches.join('')}" — use comma-below (ș, ț) instead`)
  }
}

// Check that RO translations have some Romanian characters or are ASCII-safe
const roWithDiacritics = roKeys.filter((k) => /[ăâîșțĂÂÎȘȚ]/.test(translations.ro[k]))
const roWithoutDiacritics = roKeys.filter(
  (k) => !/[ăâîșțĂÂÎȘȚ]/.test(translations.ro[k]) && translations.ro[k] !== translations.en[k]
)

console.log(`\nℹ️  Romanian keys with diacritics: ${roWithDiacritics.length}/${roKeys.length}`)
if (roWithoutDiacritics.length > 0) {
  console.warn(`⚠️  ${roWithoutDiacritics.length} RO keys differ from EN but have NO diacritics (may be intentional):`)
  roWithoutDiacritics.slice(0, 10).forEach((k) =>
    console.warn(`   - ${k}: "${translations.ro[k]}"`)
  )
}

// ── 4. Summary ──────────────────────────────────────────────────────
console.log(`\n📊 Translation audit summary:`)
console.log(`   EN keys: ${enKeys.length}`)
console.log(`   RO keys: ${roKeys.length}`)
console.log(`   Missing in RO: ${missingInRo.length}`)
console.log(`   Missing in EN: ${missingInEn.length}`)

process.exit(exitCode)
