import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Label + control + error message, wired for accessibility.
 *
 * The input is deliberately NOT controlled here: `...props` is spread last so
 * react-hook-form's `{...register('email')}` (which supplies name, onChange,
 * onBlur and ref) passes straight through untouched.
 */

interface FieldProps {
  /** Must match the input's id so the label is programmatically associated. */
  htmlFor: string
  label: string
  /** Rendered and announced via role="alert" when validation fails. */
  error?: string
  /** Optional control rendered on the label row, e.g. a "Forgot password?" link. */
  action?: ReactNode
  children: ReactNode
}

export function Field({ htmlFor, label, error, action, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
          {label}
        </label>
        {action}
      </div>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full rounded-control border border-line-strong bg-surface-raised',
        'px-3 py-2.5 text-sm text-ink',
        'placeholder:text-ink-subtle',
        'transition-colors duration-150',
        'hover:border-ink-subtle',
        'focus:border-accent focus:outline-none',
        'aria-invalid:border-danger aria-invalid:hover:border-danger',
        className
      )}
      {...props}
    />
  )
}
