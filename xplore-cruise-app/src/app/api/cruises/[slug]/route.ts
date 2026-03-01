import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

// ============================================================
// Cruise Detail API — look up full cruise data by slug
// GET /api/cruises/[slug]
// ============================================================

// Lazy-loaded full cruise database (cached in module scope)
let cruisesMap: Map<string, Record<string, unknown>> | null = null

function loadCruisesMap(): Map<string, Record<string, unknown>> {
  if (cruisesMap) return cruisesMap
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'cruises.json')
    const data = JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, unknown>[]
    cruisesMap = new Map()
    for (const c of data) {
      cruisesMap.set(c.slug as string, c)
    }
    return cruisesMap
  } catch {
    console.error('Failed to load cruises.json')
    return new Map()
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const map = loadCruisesMap()
  const cruise = map.get(slug)

  if (!cruise) {
    return NextResponse.json(
      { error: 'Cruise not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(cruise)
}
