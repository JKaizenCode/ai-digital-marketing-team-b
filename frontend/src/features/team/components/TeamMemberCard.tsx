'use client'

import { useState } from 'react'
import { MemberAvatar } from './MemberAvatar'
import type { TeamMemberView } from '../types'

/**
 * One team member card with an expandable detail view.
 *
 * Card:
 * - Fixed/consistent layout
 * - Long blurbs are truncated
 * - Photo keeps the existing 4:5 aspect ratio
 *
 * Detail view:
 * - Opens when the card is clicked
 * - Full blurb wraps naturally
 * - Long content scrolls inside its own container
 * - Does not change the size of the team grid
 */
export function TeamMemberCard({ member }: { member: TeamMemberView }) {
  const [isOpen, setIsOpen] = useState(false)

  const headingId = `team-member-${member.id}`
  const modalHeadingId = `team-member-modal-${member.id}`

  return (
    <>
      {/* Team member card */}
      <article
        aria-labelledby={headingId}
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsOpen(true)
          }
        }}
        className="rounded-card border-line bg-surface-raised hover:border-line-strong flex h-full w-full cursor-pointer flex-col overflow-hidden border transition-colors duration-150"
      >
        {/* Fixed photo area */}
        <div className="bg-surface-sunken aspect-[4/5] w-full shrink-0 overflow-hidden">
          <MemberAvatar src={member.photoURL} name={member.name} />
        </div>

        {/* Fixed content area */}
        <div className="flex min-h-0 flex-1 flex-col p-5">
          <h3
            id={headingId}
            className="display text-ink text-xl break-words hyphens-auto"
          >
            {member.name}
          </h3>

          {member.role && (
            <p className="text-ink-muted mt-1.5 text-xs font-semibold tracking-[0.12em] break-words hyphens-auto uppercase">
              {member.role}
            </p>
          )}

          {member.blurb && (
            <p className="text-ink-muted mt-3.5 line-clamp-3 text-sm leading-relaxed break-words">
              {member.blurb}
            </p>
          )}
        </div>
      </article>

      {/* Expanded member detail */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={modalHeadingId}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-surface-raised border-line flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Large photo */}
            <div className="bg-surface-sunken h-72 w-full shrink-0 overflow-hidden sm:h-96">
              <MemberAvatar src={member.photoURL} name={member.name} />
            </div>

            {/* Details */}
            <div className="flex min-h-0 flex-1 flex-col p-6">
              <div className="shrink-0">
                <h2
                  id={modalHeadingId}
                  className="display text-ink text-2xl break-words hyphens-auto"
                >
                  {member.name}
                </h2>

                {member.role && (
                  <p className="text-ink-muted mt-2 text-xs font-semibold tracking-[0.12em] break-words hyphens-auto uppercase">
                    {member.role}
                  </p>
                )}
              </div>

              {/* Scrollable description */}
              {member.blurb && (
                <div className="mt-5 min-h-0 overflow-y-auto overscroll-contain pr-2">
                  <p className="text-ink-muted text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {member.blurb}
                  </p>
                </div>
              )}

              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="border-line bg-surface-raised text-ink hover:border-line-strong mt-6 shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}