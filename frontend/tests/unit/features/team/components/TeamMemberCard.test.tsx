import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamMemberCard } from '@/features/team/components/TeamMemberCard'
import { PLACEHOLDER_SRC } from '@/features/team/components/MemberAvatar'
import type { TeamMemberView } from '@/features/team/types'

const baseMember: TeamMemberView = {
  id: 'member-01',
  name: 'Ada Lovelace',
  role: 'Frontend Developer',
  blurb: 'Builds the interface and keeps the component library honest.',
  photoURL: 'https://example.com/ada.jpg',
}

describe('TeamMemberCard', () => {
  it('renders name, role and blurb', () => {
    render(<TeamMemberCard member={baseMember} />)

    expect(screen.getByRole('heading', { name: 'Ada Lovelace' })).toBeInTheDocument()
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.getByText(/keeps the component library honest/)).toBeInTheDocument()
  })

  it('associates the card with its heading for assistive tech', () => {
    render(<TeamMemberCard member={baseMember} />)

    expect(screen.getByRole('article', { name: 'Ada Lovelace' })).toBeInTheDocument()
  })

  it('uses the placeholder when the member has no photo', () => {
    const { container } = render(<TeamMemberCard member={{ ...baseMember, photoURL: null }} />)

    expect(container.querySelector('img')).toHaveAttribute('src', PLACEHOLDER_SRC)
  })

  it('renders long text in full rather than truncating it', () => {
    const longBlurb =
      'A deliberately long blurb used to confirm that text wraps within its content ' +
      'area without clipping or overlapping neighbouring elements, continuing well ' +
      'past the length of any realistic biography so the behaviour is unambiguous.'

    render(
      <TeamMemberCard
        member={{
          ...baseMember,
          name: 'Bartholomew Fitzwilliam-Montgomery Vandersteen III',
          role: 'Senior Principal Lead Coordinator of Interdepartmental Strategy',
          blurb: longBlurb,
        }}
      />
    )

    // The full strings must be present — no ellipsis, no clamping.
    expect(
      screen.getByRole('heading', { name: 'Bartholomew Fitzwilliam-Montgomery Vandersteen III' })
    ).toBeInTheDocument()
    expect(screen.getByText(longBlurb)).toBeInTheDocument()
  })

  it('allows long unbroken words to break instead of overflowing', () => {
    render(<TeamMemberCard member={baseMember} />)

    expect(screen.getByRole('heading', { name: 'Ada Lovelace' }).className).toContain('break-words')
  })

  it('omits the role element entirely when the field is empty', () => {
    render(<TeamMemberCard member={{ ...baseMember, role: '' }} />)

    expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument()
  })
})
