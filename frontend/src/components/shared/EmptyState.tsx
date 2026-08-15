import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
}

/**
 * Restyled onto the design tokens. The Team Members page renders this when the
 * `teamMembers` collection is empty, so leaving it on the old zinc palette
 * would have put off-system styling directly inside a spec'd page.
 */
export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="bg-surface-sunken border-line flex h-12 w-12 items-center justify-center rounded-full border">
        <Icon className="text-ink-subtle h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-ink text-sm font-semibold">{title}</p>
        {description && <p className="text-ink-muted mt-1 max-w-prose text-sm">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
