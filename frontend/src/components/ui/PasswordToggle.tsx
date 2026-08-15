'use client'

import { Eye, EyeOff } from 'lucide-react'

/**
 * Show/hide affordance for a password input.
 *
 * Presentation only: the parent flips the input's `type` attribute. The
 * registered form value is never touched, so react-hook-form state and zod
 * validation are unaffected.
 *
 * Expects to be positioned inside a `relative` wrapper alongside the input,
 * which should carry `pr-11` to reserve room for it.
 */
interface PasswordToggleProps {
  visible: boolean
  onToggle: () => void
  /** Distinguishes multiple toggles on one form, e.g. "Show confirm password". */
  label?: string
}

export function PasswordToggle({ visible, onToggle, label = 'password' }: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={visible}
      className="rounded-r-control text-ink-subtle hover:text-ink absolute inset-y-0 right-0 flex w-11 items-center justify-center transition-colors"
    >
      {visible ? (
        <EyeOff className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Eye className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}
