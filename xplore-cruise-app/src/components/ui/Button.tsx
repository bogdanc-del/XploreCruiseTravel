import React, { forwardRef } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonBaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}

// Polymorphic: support as="a" for link buttons
type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    as?: 'button'
  }

type ButtonAsAnchor = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    as: 'a'
  }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 shadow-md hover:shadow-lg active:shadow-sm',
  secondary:
    'border-2 border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white',
  ghost:
    'text-navy-600 hover:bg-navy-50 hover:text-navy-800',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3 text-base rounded-lg',
}

const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    as,
    ...rest
  } = props

  const classes = clsx(
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
    variantClasses[variant],
    sizeClasses[size],
    className,
  )

  if (as === 'a') {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...anchorProps}
      >
        {children}
      </a>
    )
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...buttonProps}
    >
      {children}
    </button>
  )
})

export default Button
