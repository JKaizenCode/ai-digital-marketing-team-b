import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemberAvatar, PLACEHOLDER_SRC } from '@/features/team/components/MemberAvatar'

/**
 * Covers the two placeholder paths required by the Sprint 1 spec:
 * a photo that was never set, and a photo that fails to load.
 */
describe('MemberAvatar', () => {
  it('renders the supplied photo when one is provided', () => {
    render(<MemberAvatar src="https://example.com/ada.jpg" name="Ada Lovelace" />)

    const img = screen.getByAltText('Portrait of Ada Lovelace')
    expect(img).toHaveAttribute('src', 'https://example.com/ada.jpg')
  })

  it('falls back to the placeholder when photoURL is null', () => {
    const { container } = render(<MemberAvatar src={null} name="Ada Lovelace" />)

    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', PLACEHOLDER_SRC)
  })

  it('swaps in the placeholder when the photo fails to load', () => {
    const { container } = render(
      <MemberAvatar src="https://example.invalid/missing.jpg" name="Ada Lovelace" />
    )

    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', 'https://example.invalid/missing.jpg')

    fireEvent.error(img!)

    expect(container.querySelector('img')).toHaveAttribute('src', PLACEHOLDER_SRC)
  })

  it('leaves the placeholder undescribed so the name is not announced twice', () => {
    const { container } = render(<MemberAvatar src={null} name="Ada Lovelace" />)

    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })

  it('crops rather than stretches the photo', () => {
    const { container } = render(<MemberAvatar src="https://example.com/ada.jpg" name="Ada" />)

    expect(container.querySelector('img')?.className).toContain('object-cover')
  })
})
