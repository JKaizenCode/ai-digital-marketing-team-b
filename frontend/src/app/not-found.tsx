import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <main className="bg-surface flex min-h-screen flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <p className="display text-ink-subtle text-7xl leading-none">404</p>
      <h1 className="display text-ink mt-2 text-2xl">Page not found</h1>
      <p className="text-ink-muted max-w-prose text-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className={`${buttonVariants({ size: 'lg' })} mt-6`}>
        Go home
      </Link>
    </main>
  )
}
