import type { Metadata } from 'next'
import { getServerSession } from '@/actions/auth.actions'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function ProfilePage() {
  // Session logic unchanged — restyle only.
  const session = await getServerSession()

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profile" description="Manage your account details." />

      <Card className="mt-8">
        <dl className="space-y-1">
          <dt className="text-ink-muted text-xs font-semibold tracking-[0.12em] uppercase">
            Email
          </dt>
          <dd className="text-ink text-sm break-words">{session?.email ?? '—'}</dd>
        </dl>
      </Card>
    </div>
  )
}
