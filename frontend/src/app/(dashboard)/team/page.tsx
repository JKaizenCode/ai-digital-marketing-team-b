import type { Metadata } from 'next'
import { Users } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/layout/PageHeader'
import { getTeamMembers } from '@/features/team/actions/team.actions'
import { TeamMemberCard } from '@/features/team/components/TeamMemberCard'

export const metadata: Metadata = {
  title: 'Team Members',
}

/**
 * Team name shown as the page's main heading (spec §7).
 * Set NEXT_PUBLIC_TEAM_NAME in .env.local to override.
 */
const teamName = process.env.NEXT_PUBLIC_TEAM_NAME ?? process.env.NEXT_PUBLIC_APP_NAME ?? 'Our Team'

export default async function TeamPage() {
  const result = await getTeamMembers()
  const members = result.data ?? []

  return (
    <div className="mx-auto max-w-6xl">
      {/* Shared header treatment — the team name is the page's main heading
          per spec §7, and PageHeader is what every dashboard route uses. */}
      <PageHeader
        title={teamName}
        description="The people behind the work, and what each of them looks after."
      />

      {!result.success ? (
        <div
          role="alert"
          className="rounded-card border-danger/30 bg-danger-soft text-danger mt-8 border px-5 py-4 text-sm"
        >
          {result.error}
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No team members yet"
          description="Team members will appear here once they have been added."
        />
      ) : (
        <>
          {/* auto-fill rather than a fixed column count: the layout stays
              sensible from one member to fifty without further breakpoints.
              min() keeps a single card from overflowing a narrow phone. */}
          <ul
            role="list"
            className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,17rem),1fr))] items-stretch gap-5 sm:gap-6"
          >
            {members.map((member) => (
              <li key={member.id} className="flex">
                <TeamMemberCard member={member} />
              </li>
            ))}
          </ul>

          <p className="text-ink-subtle mt-8 text-xs">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </p>
        </>
      )}
    </div>
  )
}
