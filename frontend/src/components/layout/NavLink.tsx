'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, User, Users, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavIconName, NavItem } from './nav-items'

/**
 * Icon registry. Lives on the client side of the boundary so that nav-items.ts
 * can stay plain serialisable data — see the note in that file.
 */
const icons: Record<NavIconName, LucideIcon> = {
  dashboard: LayoutDashboard,
  team: Users,
  profile: User,
  settings: Settings,
}

interface NavLinkProps extends NavItem {
  /** Called after navigation — used by the mobile drawer to close itself. */
  onNavigate?: () => void
}

/**
 * A single navigation row with active-state styling.
 *
 * Isolated as a Client Component so Sidebar can remain a Server Component:
 * `usePathname` is the only thing here that needs the browser.
 */
export function NavLink({ href, label, icon, onNavigate }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)
  const Icon = icons[icon]

  return (
    <Link
      href={href}
      onClick={onNavigate}
      // Communicates the active page to assistive tech, not just visually.
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'rounded-control flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-150',
        isActive
          ? 'bg-accent-soft text-ink font-semibold'
          : 'text-ink-muted hover:bg-surface-sunken hover:text-ink font-medium'
      )}
    >
      <Icon
        className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-accent' : 'text-ink-subtle')}
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
    </Link>
  )
}
