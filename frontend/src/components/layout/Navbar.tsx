'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { MobileNav } from './MobileNav'

export function Navbar() {
  const router = useRouter()
  const { user, signOut } = useAuth()

  // Unchanged from the original: clears the session then redirects.
  const handleSignOut = async () => {
    await signOut()
    router.replace('/auth/signin')
    router.refresh()
  }

  return (
    <header className="border-line bg-surface-raised flex h-16 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
      {/* Below lg the Sidebar is hidden, so the drawer trigger lives here. */}
      <MobileNav />

      <span className="display text-ink truncate text-lg lg:hidden">
        {process.env.NEXT_PUBLIC_APP_NAME ?? 'App'}
      </span>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {user && (
          <span className="text-ink-muted hidden max-w-[18ch] truncate text-sm sm:block">
            {user.email}
          </span>
        )}
        <Link
          href="/profile"
          className="border-line bg-surface-sunken text-ink-muted hover:border-line-strong hover:text-ink flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          aria-label="Profile"
        >
          <User className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-ink-subtle hover:bg-surface-sunken hover:text-ink flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
