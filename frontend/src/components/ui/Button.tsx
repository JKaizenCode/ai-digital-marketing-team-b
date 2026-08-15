import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Shared button. Every interactive control in the restyled surfaces routes
 * through here so hover, disabled and focus behaviour cannot drift.
 *
 * Purely presentational — it forwards every native button prop, so existing
 * `type="submit"`, `onClick` and `disabled` wiring is unaffected.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-control font-medium',
    'transition-colors duration-150',
    'disabled:pointer-events-none disabled:opacity-55',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
        outline:
          'border border-line-strong bg-surface-raised text-ink hover:bg-surface-sunken',
        ghost: 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
      block: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, block, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, block }), className)} {...props} />
  )
}

export { buttonVariants }
