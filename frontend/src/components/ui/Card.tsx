import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Surface container. One radius, one hairline border, no shadow — every panel
 * in the app routes through here so card treatment cannot drift between pages.
 *
 * Padding is included by default; pass `className="p-0"` for flush content
 * (twMerge resolves the conflict).
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-card border-line bg-surface-raised border p-6', className)}
      {...props}
    />
  )
}
