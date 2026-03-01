'use client'

import React from 'react'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'
import type { TravelParty } from '@/context/GuidedFlowContext'
import { OptionCard } from './GuidedStepExperience'

// ============================================================
// Step 2: "Who are you traveling with?"
// ============================================================

interface GuidedStepTravelPartyProps {
  value: TravelParty | null
  onChange: (val: TravelParty) => void
  locale: Locale
}

const OPTIONS: { key: TravelParty; icon: React.ReactNode }[] = [
  { key: 'solo', icon: <SoloIcon /> },
  { key: 'couple', icon: <CoupleIcon /> },
  { key: 'family', icon: <FamilyIcon /> },
  { key: 'friends', icon: <FriendsIcon /> },
  { key: 'group', icon: <GroupIcon /> },
]

const TRANSLATION_MAP: Record<TravelParty, string> = {
  solo: 'guided_q2_solo',
  couple: 'guided_q2_couple',
  family: 'guided_q2_family',
  friends: 'guided_q2_friends',
  group: 'guided_q2_group',
}

export default function GuidedStepTravelParty({ value, onChange, locale }: GuidedStepTravelPartyProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900 font-[family-name:var(--font-heading)] text-center mb-2">
        {t('guided_q2', locale)}
      </h2>
      <p className="text-sm text-navy-500 text-center mb-8">
        {locale === 'ro'
          ? 'Selectează opțiunea care te descrie cel mai bine.'
          : 'Select the option that best describes your trip.'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.key}
            selected={value === opt.key}
            onClick={() => onChange(opt.key)}
            icon={opt.icon}
            label={t(TRANSLATION_MAP[opt.key] as 'guided_q2_solo', locale)}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Icons
// ============================================================

function SoloIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function CoupleIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  )
}

function FamilyIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  )
}

function FriendsIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function GroupIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  )
}
