import { navItems } from './nav-items'
import { NavLink } from './NavLink'

/**
 * Desktop navigation rail (>= lg). Below that breakpoint MobileNav takes over.
 *
 * Stays a Server Component: the active-state logic that needs `usePathname`
 * lives in NavLink, which is the only client boundary here.
 */
export function Sidebar() {
  return (
    <aside className="border-line bg-surface-raised hidden w-64 shrink-0 flex-col border-r lg:flex">
      <div className="border-line flex h-16 items-center border-b px-5">
        <span className="display text-ink truncate text-lg">
          {process.env.NEXT_PUBLIC_APP_NAME ?? 'App'}
        </span>
      </div>

      <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>
    </aside>
  )
}
