import { MemberAvatar } from './MemberAvatar'
import type { TeamMemberView } from '../types'

/**
 * One team member: photo above details.
 *
 * Resilience notes (spec §8):
 *   - the photo frame is a fixed 4:5 box with `object-cover`, so any source
 *     aspect ratio crops rather than stretches
 *   - `break-words` + `hyphens-auto` keep a long unbroken name or role inside
 *     the card instead of forcing horizontal overflow
 *   - the blurb is never clamped, so long text wraps in full without clipping;
 *     `items-stretch` on the grid keeps neighbouring cards the same height
 */
export function TeamMemberCard({ member }: { member: TeamMemberView }) {
  const headingId = `team-member-${member.id}`

  return (
    <article
      aria-labelledby={headingId}
      className="rounded-card border-line bg-surface-raised hover:border-line-strong flex w-full flex-col overflow-hidden border transition-colors duration-150"
    >
      <div className="bg-surface-sunken aspect-[4/5] w-full overflow-hidden">
        <MemberAvatar src={member.photoURL} name={member.name} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 id={headingId} className="display text-ink text-xl break-words hyphens-auto">
          {member.name}
        </h3>

        {member.role && (
          <p className="text-ink-muted mt-1.5 text-xs font-semibold tracking-[0.12em] break-words hyphens-auto uppercase">
            {member.role}
          </p>
        )}

        {member.blurb && (
          <p className="text-ink-muted mt-3.5 text-sm leading-relaxed break-words">
            {member.blurb}
          </p>
        )}
      </div>
    </article>
  )
}
