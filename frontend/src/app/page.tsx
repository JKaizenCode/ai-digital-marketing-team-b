import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to the app',
}

export default function LandingPage() {
  return (
    <main className="bg-surface flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="max-w-xl space-y-5 text-center">
        <h1 className="display text-ink text-5xl text-balance">
          {process.env.NEXT_PUBLIC_APP_NAME ?? 'App'}
        </h1>
        <p className="text-ink-muted text-base leading-relaxed">
          A secure internal dashboard for Apsis VR staff — sign in, view the team, manage your account.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/auth/signin" className={buttonVariants({ size: 'lg' })}>
          Sign in
        </Link>
        <Link href="/auth/signup" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          Create account
        </Link>
      </div>
    </main>
  )
}
