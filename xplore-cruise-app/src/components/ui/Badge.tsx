import React from 'react'
import clsx from 'clsx'

type BadgeVariant = 'gold' | 'navy' | 'ocean' | 'success' | 'warning'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold-100 text-gold-700 border-gold-300',
  navy: 'bg-navy-100 text-navy-700 border-navy-300',
  ocean: 'bg-sky-100 text-sky-700 border-sky-300',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  warning: 'bg-amber-100 text-amber-700 border-amber-300',
}

export default function Badge({
  children,
  variant = 'gold',
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
