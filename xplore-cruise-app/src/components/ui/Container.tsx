import React from 'react'
import clsx from 'clsx'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export default function Container({
  children,
  className,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </Component>
  )
}
