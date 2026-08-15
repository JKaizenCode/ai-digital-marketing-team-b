import type { Metadata } from 'next'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Settings',
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" description="Manage your application settings." />

      <Card className="mt-8">
        <p className="text-ink-subtle text-sm">Settings will appear here.</p>
      </Card>
    </div>
  )
}
