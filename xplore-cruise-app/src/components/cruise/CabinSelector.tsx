'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'
import { normalizeCabinCategory, getCabinImage, getCabinCategoryLabel, getCabinDescription } from '@/data/cabin-images'
import type { CabinImageSet } from '@/data/cabin-images'
import { useExchangeRate } from '@/context/ExchangeRateContext'

// ============================================================
// Types
// ============================================================

interface RoomEntry {
  name: string
  category: string
  date: string
  price: number
}

// ============================================================
// Smart cabin description generator — based on room name keywords
// ============================================================

function getCabinSubTypeFeatures(name: string, category: keyof CabinImageSet, locale: 'en' | 'ro'): string[] {
  const low = name.toLowerCase()
  const features: string[] = []

  // Guarantee-specific
  if (low.includes('garantat') || low.includes('guarante')) {
    features.push(locale === 'ro'
      ? 'Cabina este alocată de companie — nu poți alege locația exactă'
      : 'Cabin assigned by the cruise line — exact location cannot be chosen')
    features.push(locale === 'ro' ? 'Cel mai bun preț disponibil' : 'Best available price')
  }

  // Obstructed view
  if (low.includes('obstru') || low.includes('obstructed') || low.includes('restricted')) {
    features.push(locale === 'ro'
      ? 'Vedere parțial obstrucționată (barcă de salvare sau structură)'
      : 'Partially obstructed view (lifeboat or structure)')
  }

  // Based on normalized category
  switch (category) {
    case 'interior':
      features.push(locale === 'ro' ? 'Pat dublu sau 2 paturi twin' : 'Double or twin beds')
      features.push(locale === 'ro' ? 'Baie privată cu duș' : 'Private bathroom with shower')
      features.push(locale === 'ro' ? 'TV, aer condiționat, seif' : 'TV, air conditioning, safe')
      if (!low.includes('garantat') && !low.includes('guarante')) {
        features.push(locale === 'ro' ? 'Aprox. 12-17 m²' : 'Approx. 12-17 sqm')
      }
      break
    case 'ocean_view':
      features.push(locale === 'ro' ? 'Fereastră sau hublou cu vedere la mare' : 'Window or porthole with sea views')
      features.push(locale === 'ro' ? 'Pat dublu sau 2 paturi twin' : 'Double or twin beds')
      features.push(locale === 'ro' ? 'Baie privată cu duș' : 'Private bathroom with shower')
      features.push(locale === 'ro' ? 'Aprox. 15-20 m²' : 'Approx. 15-20 sqm')
      break
    case 'balcony':
      features.push(locale === 'ro' ? 'Balcon privat cu mobilier' : 'Private furnished balcony')
      features.push(locale === 'ro' ? 'Vedere panoramică la mare' : 'Panoramic sea view')
      features.push(locale === 'ro' ? 'Pat dublu sau 2 paturi twin' : 'Double or twin beds')
      features.push(locale === 'ro' ? 'Baie privată cu duș' : 'Private bathroom with shower')
      features.push(locale === 'ro' ? 'Aprox. 20-30 m² (incl. balcon)' : 'Approx. 20-30 sqm (incl. balcony)')
      break
    case 'suite':
      features.push(locale === 'ro' ? 'Zonă de zi separată' : 'Separate living area')
      features.push(locale === 'ro' ? 'Balcon privat (de obicei mai mare)' : 'Private balcony (usually larger)')
      features.push(locale === 'ro' ? 'Îmbarcare prioritară' : 'Priority boarding')
      features.push(locale === 'ro' ? 'Servicii exclusive la bord' : 'Exclusive onboard services')
      if (low.includes('grand') || low.includes('royal') || low.includes('owner')) {
        features.push(locale === 'ro' ? 'Serviciu de butler' : 'Butler service')
        features.push(locale === 'ro' ? 'Acces lounge privat' : 'Private lounge access')
      }
      if (low.includes('yacht') || low.includes('haven')) {
        features.push(locale === 'ro' ? 'Acces exclusiv la zona Yacht Club/Haven' : 'Exclusive Yacht Club/Haven area access')
        features.push(locale === 'ro' ? 'Restaurant și bar privat' : 'Private restaurant and bar')
      }
      break
  }

  return features
}

export interface SelectedCabin {
  name: string
  category: string
  normalizedCategory: keyof CabinImageSet
  price: number
  date: string
}

interface CabinSelectorProps {
  rooms: RoomEntry[]
  selectedDate: string | null
  cruiseLine: string
  locale: Locale
  onSelect?: (cabin: SelectedCabin | null) => void
}

// ============================================================
// Group rooms by normalized category for the selected date
// ============================================================

/** Sub-type within a category (e.g., "Cabina interioara garantata" within Interior) */
interface CabinSubType {
  name: string          // API room name (e.g., "Cabina interioara garantata")
  code: string          // API category code (e.g., "IS")
  price: number         // Best price for this sub-type
}

interface CabinGroup {
  category: keyof CabinImageSet
  label: string
  description: string
  priceFrom: number
  cabinCount: number
  rooms: RoomEntry[]
  image: string
  subTypes: CabinSubType[]  // Individual sub-categories within this group
}

function groupRoomsByCategory(
  rooms: RoomEntry[],
  selectedDate: string,
  cruiseLine: string,
  locale: Locale
): CabinGroup[] {
  // Filter rooms for the selected date
  const dateRooms = rooms.filter(r => r.date === selectedDate && r.price > 0)

  // Group by normalized category (using room name for accurate detection)
  const groups = new Map<keyof CabinImageSet, RoomEntry[]>()
  for (const room of dateRooms) {
    const cat = normalizeCabinCategory(room.category, room.name)
    const arr = groups.get(cat)
    if (arr) arr.push(room)
    else groups.set(cat, [room])
  }

  // Convert to array with metadata
  const order: (keyof CabinImageSet)[] = ['interior', 'ocean_view', 'balcony', 'suite']
  return order
    .filter(cat => groups.has(cat))
    .map(cat => {
      const rms = groups.get(cat)!
      const priceFrom = Math.min(...rms.map(r => r.price))

      // Build sub-types: group by room name within this category
      const subMap = new Map<string, { name: string; code: string; price: number }>()
      for (const r of rms) {
        const key = r.name || r.category
        const existing = subMap.get(key)
        if (!existing || r.price < existing.price) {
          subMap.set(key, { name: r.name || r.category, code: r.category, price: r.price })
        }
      }
      const subTypes = [...subMap.values()].sort((a, b) => a.price - b.price)

      return {
        category: cat,
        label: getCabinCategoryLabel(cat, locale),
        description: getCabinDescription(cat, locale),
        priceFrom,
        cabinCount: rms.length,
        rooms: rms,
        image: getCabinImage(cruiseLine, cat),
        subTypes,
      }
    })
}

// ============================================================
// CabinSelector Component
// ============================================================

export default function CabinSelector({
  rooms,
  selectedDate,
  cruiseLine,
  locale,
  onSelect,
}: CabinSelectorProps) {
  const { rateWithMargin } = useExchangeRate()
  const [selectedCategory, setSelectedCategory] = useState<keyof CabinImageSet | null>(null)

  const cabinGroups = useMemo(() => {
    if (!selectedDate || rooms.length === 0) return []
    return groupRoomsByCategory(rooms, selectedDate, cruiseLine, locale)
  }, [rooms, selectedDate, cruiseLine, locale])

  const handleSelect = (group: CabinGroup) => {
    const newSelection = selectedCategory === group.category ? null : group.category
    setSelectedCategory(newSelection)

    if (onSelect) {
      if (newSelection) {
        const cheapestRoom = group.rooms.reduce((min, r) => r.price < min.price ? r : min, group.rooms[0])
        onSelect({
          name: cheapestRoom.name,
          category: cheapestRoom.category,
          normalizedCategory: group.category,
          price: group.priceFrom,
          date: selectedDate!,
        })
      } else {
        onSelect(null)
      }
    }
  }

  // No date selected
  if (!selectedDate) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <p className="text-sm text-navy-500">
          {t('cabin_no_date' as 'loading', locale)}
        </p>
      </div>
    )
  }

  // No room data
  if (cabinGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>
        <p className="text-sm text-navy-500">
          {t('cabin_no_data' as 'loading', locale)}
        </p>
      </div>
    )
  }

  const selectLabel = locale === 'ro' ? 'Selectează' : 'Select'
  const deselectLabel = locale === 'ro' ? 'Deselectează' : 'Deselect'
  const featuresTitle = locale === 'ro' ? 'Ce include cabina' : 'Cabin features'

  return (
    <div className="space-y-4">
      <p className="text-sm text-navy-500">
        {t('cabin_select_subtitle' as 'loading', locale)}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cabinGroups.map(group => {
          const isSelected = selectedCategory === group.category
          const priceRon = Math.round(group.priceFrom * rateWithMargin)
          // Get features for the cheapest sub-type in this category
          const categoryFeatures = getCabinSubTypeFeatures(
            group.subTypes[0]?.name || '',
            group.category,
            locale as 'en' | 'ro'
          )

          return (
            <div
              key={group.category}
              className={`relative overflow-hidden rounded-xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-gold-500 shadow-lg ring-2 ring-gold-200'
                  : 'border-navy-200 hover:border-gold-300 hover:shadow-md'
              }`}
            >
              {/* Cabin image */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={group.image}
                  alt={group.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                )}

                {/* Category label overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm">{group.label}</p>
                </div>
              </div>

              {/* Description + Sub-types + Features + Price + Select Button */}
              <div className="p-3">
                <p className="text-[11px] text-navy-500 leading-snug mb-3 line-clamp-2">
                  {group.description}
                </p>

                {/* Features panel — always visible, shows what the cabin includes */}
                {categoryFeatures.length > 0 && (
                  <div className="mb-3 py-2 px-2.5 rounded-lg bg-navy-50/60 border border-navy-100">
                    <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider mb-1.5">
                      {featuresTitle}
                    </p>
                    <ul className="space-y-1">
                      {categoryFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-navy-600 leading-snug">
                          <svg className="w-3 h-3 text-gold-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sub-types list — shows individual cabin types with their prices */}
                {group.subTypes.length > 1 && (
                  <div className="mb-3 space-y-1.5">
                    <p className="text-[10px] font-semibold text-navy-400 uppercase tracking-wider">
                      {locale === 'ro' ? 'Tipuri disponibile' : 'Available types'}
                    </p>
                    {group.subTypes.map((sub, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-navy-600 truncate">{sub.name}</span>
                        <span className="font-semibold text-navy-800 whitespace-nowrap">
                          &euro;{sub.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end justify-between gap-2 pt-2 border-t border-navy-100">
                  <div>
                    <p className="text-xs text-navy-400">
                      {t('cruise_from', locale)}
                    </p>
                    <p className="text-lg font-bold text-navy-900">
                      &euro;{group.priceFrom.toLocaleString()}
                      <span className="text-xs font-normal text-navy-400">
                        {t('cruise_per_person', locale)}
                      </span>
                    </p>
                    {locale === 'ro' && (
                      <p className="text-xs text-gold-600">
                        ~{priceRon.toLocaleString()} Lei
                      </p>
                    )}
                  </div>
                  {/* Explicit Select / Deselect button */}
                  <button
                    onClick={() => handleSelect(group)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-gold-500 text-white hover:bg-gold-600 active:scale-95'
                        : 'bg-navy-700 text-white hover:bg-navy-800 active:scale-95'
                    }`}
                  >
                    {isSelected ? deselectLabel : selectLabel}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
