'use client'

import React from 'react'
import type { Locale } from '@/i18n/translations'
import { t } from '@/i18n/translations'
import type { Priority } from '@/context/GuidedFlowContext'
import { OptionCard } from './GuidedStepExperience'

// ============================================================
// Step 3: "What matters most to you?"
// ============================================================

interface GuidedStepPriorityProps {
  value: Priority | null
  onChange: (val: Priority) => void
  locale: Locale
}

const OPTIONS: { key: Priority; icon: React.ReactNode }[] = [
  { key: 'budget', icon: <BudgetIcon /> },
  { key: 'luxury', icon: <LuxuryIcon /> },
  { key: 'family', icon: <FamilyIcon /> },
  { key: 'adventure', icon: <AdventureIcon /> },
  { key: 'relaxation', icon: <RelaxIcon /> },
]

const TRANSLATION_MAP: Record<Priority, string> = {
  budget: 'guided_q3_budget',
  luxury: 'guided_q3_luxury',
  family: 'guided_q3_family',
  adventure: 'guided_q3_adventure',
  relaxation: 'guided_q3_relaxation',
}

export default function GuidedStepPriority({ value, onChange, locale }: GuidedStepPriorityProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900 font-[family-name:var(--font-heading)] text-center mb-2">
        {t('guided_q3', locale)}
      </h2>
      <p className="text-sm text-navy-500 text-center mb-8">
        {locale === 'ro'
          ? 'Alege aspectul cel mai important pentru tine.'
          : 'Choose what\'s most important to you.'}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.key}
            selected={value === opt.key}
            onClick={() => onChange(opt.key)}
            icon={opt.icon}
            label={t(TRANSLATION_MAP[opt.key] as 'guided_q3_budget', locale)}
          />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Icons
// ============================================================

function BudgetIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function LuxuryIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}

function FamilyIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  )
}

function AdventureIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.592L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67" />
    </svg>
  )
}

function RelaxIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  )
}
