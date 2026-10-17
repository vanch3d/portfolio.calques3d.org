/**
 * Button — the three-variant action atom (Primary / Secondary / Text-action).
 * Plain `<button>`, no Base UI wrapper (ADR 009). Variants via CVA (ADR 024).
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

const buttonVariants = cva(
  // base — shared by every variant, written once
  [
    'label',
    'appearance-none',
    'cursor-pointer',
    'py-sm',
    'transition-colors',
    'duration-150',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'border-medium border-ink bg-ink px-md text-ground', // structure / fill
          'active:live-line-pressed active:outline-ink', // pressed
          'disabled:border-ink-ghost disabled:bg-transparent disabled:text-ink-ghost', // disabled
        ],
        secondary: [
          'border-medium border-ink-secondary bg-transparent px-md text-ink', // structure / fill
          'hover:border-ink', // hover
          'active:live-line-pressed active:outline-ink active:border-ink active:bg-ink-wash', // pressed
          'disabled:border-ink-ghost disabled:bg-transparent disabled:text-ink-ghost', // disabled
        ],
        'text-action': [
          'border-none bg-transparent px-0 text-ink-secondary underline decoration-transparent underline-offset-2', // structure
          'hover:text-ink hover:decoration-ink', // hover
          'active:text-ink active:font-medium', // pressed
          'disabled:text-ink-ghost disabled:no-underline disabled:decoration-transparent', // disabled
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

type ButtonProps = VariantProps<typeof buttonVariants> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode
  }

export function Button({ variant, type = 'button', className, children, ...rest }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant }), className)} {...rest}>
      {children}
    </button>
  )
}
