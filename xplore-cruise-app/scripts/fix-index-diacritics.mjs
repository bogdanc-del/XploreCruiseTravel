/**
 * Fix Romanian diacritics in cruises-index.json
 * This is the compact index used by the /api/cruises API route
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const indexPath = join(__dirname, '..', 'public', 'data', 'cruises-index.json')

// Same replacements as fix-diacritics.ts
const REPLACEMENTS = [
  [/\bCroaziera\b/g, 'Croazieră'],
  [/\bcroaziera\b/g, 'croazieră'],
  [/\bnopti\b/g, 'nopți'],
  [/\bnoptii\b/g, 'nopții'],
  [/\bMediterana\b/g, 'Mediterană'],
  [/\bmediterana\b/g, 'mediterană'],
  [/\bRepozitionari\b/g, 'Repoziționări'],
  [/\brepozitionari\b/g, 'repoziționări'],
  [/\bRepozitionare\b/g, 'Repoziționare'],
  [/\bFranta\b/g, 'Franța'],
  [/\bRomania\b/g, 'România'],
  [/\bScotia\b/g, 'Scoția'],
  [/\bElvetia\b/g, 'Elveția'],
  [/\bCroatia\b/g, 'Croația'],
  [/\bOrientul Indepartat\b/g, 'Orientul Îndepărtat'],
  [/\bIndepartat\b/g, 'Îndepărtat'],
  [/\bindepartat\b/g, 'îndepărtat'],
  [/\bsi\b/g, 'și'],
  [/\bCampulung\b/g, 'Câmpulung'],
  [/\bNoua\b/g, 'Nouă'],
  [/\bnoua\b/g, 'nouă'],
  [/\bTarile\b/g, 'Țările'],
  [/\btarile\b/g, 'țările'],
  [/\bpersoana\b/g, 'persoană'],
]

function fixDiacritics(text) {
  if (!text) return text
  let result = text
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

// Load index
const data = JSON.parse(readFileSync(indexPath, 'utf8'))
console.log(`Loaded ${data.length} entries from cruises-index.json`)

let titlesFixed = 0
let destFixed = 0

for (const entry of data) {
  // Fix title (field "t")
  const oldTitle = entry.t
  entry.t = fixDiacritics(entry.t)
  if (entry.t !== oldTitle) titlesFixed++

  // Fix destination_ro (field "dr")
  if (entry.dr) {
    const oldDr = entry.dr
    entry.dr = fixDiacritics(entry.dr)
    if (entry.dr !== oldDr) destFixed++
  }

  // Fix destination (field "d") - might also have issues
  if (entry.d) {
    entry.d = fixDiacritics(entry.d)
  }

  // Fix departure_port (field "dp") - might have country names
  if (entry.dp) {
    entry.dp = fixDiacritics(entry.dp)
  }
}

writeFileSync(indexPath, JSON.stringify(data))
console.log(`Fixed ${titlesFixed} titles, ${destFixed} destination_ro entries`)
console.log('Saved cruises-index.json')
