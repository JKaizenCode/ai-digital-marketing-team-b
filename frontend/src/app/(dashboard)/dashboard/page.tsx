import type { Metadata } from 'next'
import { getServerSession } from '@/actions/auth.actions'
import { adminDb } from '@/lib/firebase/admin'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  // Data logic unchanged — restyle only.
  const session = await getServerSession()
  const profileSnap = session ? await adminDb.collection('users').doc(session.uid).get() : null

  const displayName = profileSnap?.exists
    ? (profileSnap.data()?.displayName as string | null)
    : null
  const greetingName = displayName ?? session?.email ?? null

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Dashboard"
        description={`Welcome back${greetingName ? `, ${greetingName}` : ''}.`}
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {(['Metric One', 'Metric Two', 'Metric Three'] as const).map((title) => (
          <Card key={title}>
            <p className="text-ink-muted text-xs font-semibold tracking-[0.12em] uppercase">
              {title}
            </p>
            <p className="display text-ink mt-3 text-4xl">—</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
