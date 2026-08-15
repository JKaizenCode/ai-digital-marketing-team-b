import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface flex h-screen overflow-hidden">
      {/* Lets keyboard users jump past the nav rail straight to page content. */}
      <a
        href="#main-content"
        className="focus:rounded-control focus:bg-accent focus:text-accent-ink sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        {/* Skip link target, and the scroll container for page content. */}
        <main id="main-content" className="flex-1 overflow-y-auto px-5 py-8 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  )
}
