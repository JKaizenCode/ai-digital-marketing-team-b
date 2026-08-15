import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication',
}

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'App'

/**
 * Two-panel authentication shell.
 *
 * Desktop: a flat brand panel sits beside the form, giving the page a centre
 * of gravity instead of a lone box floating in whitespace.
 * Mobile (< lg): the brand panel collapses to a compact wordmark so the form
 * stays above the fold on a small screen.
 *
 * Shared by /auth/signin and /auth/signup. This only provides the frame — it
 * makes no assumptions about either page's internal markup.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Brand panel — decorative; the form column carries the page heading. */}
      <aside className="bg-panel border-line hidden px-12 py-16 lg:flex lg:flex-col lg:justify-between lg:border-r">
        <p className="display text-panel-ink text-2xl">{appName}</p>

        <div className="max-w-md">
          <span aria-hidden="true" className="bg-panel-ink/30 block h-px w-12" />
          <p className="display text-panel-ink mt-8 text-4xl leading-[1.15] text-balance">
            The team workspace, in one place.
          </p>
          <p className="text-panel-ink/70 mt-5 text-sm leading-relaxed">
            Sign in to reach your dashboard, your team and your account settings.
          </p>
        </div>

        <p className="text-panel-ink/50 text-xs">
          &copy; {new Date().getFullYear()} {appName}
        </p>
      </aside>

      {/* Form column */}
      <main className="flex min-h-screen flex-col justify-center px-5 py-12 sm:px-8 lg:min-h-screen lg:px-16">
        {/* Compact wordmark, mobile only — the desktop panel covers this above. */}
        <p className="display text-ink mb-10 text-xl lg:hidden">{appName}</p>

        <div className="w-full max-w-sm lg:mx-auto">{children}</div>
      </main>
    </div>
  )
}
