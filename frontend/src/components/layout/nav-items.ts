/**
 * Single source of truth for dashboard navigation.
 *
 * Both the desktop Sidebar (a Server Component) and the mobile drawer (a
 * Client Component) read from this array, so the two cannot drift apart.
 *
 * IMPORTANT: `icon` is a string key, not a component. Sidebar renders on the
 * server and passes each item into NavLink, which is a Client Component —
 * React cannot serialise a function across that boundary, so a Lucide
 * component here would throw at request time. NavLink resolves the key to an
 * icon on the client instead. Keep every field in this file serialisable.
 *
 * Order matters: "Team Members" sits directly below "Dashboard" per the
 * Sprint 1 spec (AC02).
 */

export type NavIconName = 'dashboard' | 'team' | 'profile' | 'settings'

export interface NavItem {
  href: string
  label: string
  icon: NavIconName
}

export const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/team', label: 'Team Members', icon: 'team' },
  { href: '/profile', label: 'Profile', icon: 'profile' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]
