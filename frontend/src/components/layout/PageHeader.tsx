import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

/**
 * The single page-title treatment for every dashboard route.
 *
 * This component already existed but no page used it — each page hand-rolled
 * its own `<h1>`, which is how the hierarchy drifted in the first place.
 * Routing every page through here is what keeps "consistent typography and
 * hierarchy" (spec §10) true as more pages get added.
 *
 * `min-w-0` + `break-words` stop a long title from pushing actions off the row.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="border-line flex flex-wrap items-start justify-between gap-4 border-b pb-6">
      <div className="min-w-0">
        <h1 className="display text-ink text-3xl break-words sm:text-4xl">{title}</h1>
        {description && <p className="text-ink-muted mt-2 max-w-prose text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}
