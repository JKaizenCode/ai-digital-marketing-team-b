'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { navItems } from './nav-items'
import { NavLink } from './NavLink'

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'App'

/**
 * Navigation drawer for viewports below `lg`, where the desktop Sidebar is
 * hidden.
 *
 * The original boilerplate had no mobile navigation at all — the Sidebar was
 * `hidden lg:flex` with nothing taking its place — so a signed-in user on a
 * phone could not move between pages. This satisfies the spec's requirement
 * that Team Members stays discoverable through a collapsed-menu pattern.
 *
 * Accessibility: labelled dialog, Escape to close, background scroll locked
 * while open, focus moved into the panel on open and returned to the trigger
 * on close.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }

      // Focus trap: keep Tab inside the drawer while it is modal, so keyboard
      // users cannot tab onto the inert page behind it.
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      const active = document.activeElement

      // Wrapping backwards from the first element (or from the panel itself,
      // which holds focus immediately after opening) lands on the last.
      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    // Move focus into the drawer so keyboard and screen reader users land
    // inside it rather than continuing through the page behind.
    panelRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        className="rounded-control text-ink-muted hover:bg-surface-sunken hover:text-ink flex h-9 w-9 items-center justify-center transition-colors lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop. Presentational — Escape and the close button provide
              the accessible ways out. */}
          <div
            aria-hidden="true"
            onClick={close}
            className="bg-ink/40 absolute inset-0 backdrop-blur-[2px]"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            tabIndex={-1}
            className="border-line bg-surface-raised absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col border-r focus:outline-none"
          >
            <div className="border-line flex h-16 items-center justify-between border-b px-4">
              <span className="display text-ink truncate text-lg">{appName}</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close navigation menu"
                className="rounded-control text-ink-muted hover:bg-surface-sunken hover:text-ink flex h-9 w-9 shrink-0 items-center justify-center transition-colors"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto p-3">
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} onNavigate={close} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
