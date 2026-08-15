'use client'

import { useEffect, useRef, useState } from 'react'

/** The approved placeholder, used when a photo is absent or fails to load. */
export const PLACEHOLDER_SRC = '/images/team-placeholder.svg'

interface MemberAvatarProps {
  /** Photo URL, or null when the member has no photo set. */
  src: string | null
  /** Used for alt text. Not rendered visually. */
  name: string
}

/**
 * Team member portrait with a runtime fallback.
 *
 * Handles both failure modes the spec calls out:
 *   - no photo set        → `src` is null, placeholder renders immediately
 *   - photo fails to load → `onError` fires, placeholder replaces it
 *
 * Client component because `onError` is a browser event; it is the only part
 * of the team card that ships JavaScript.
 *
 * Uses a plain <img> rather than next/image on purpose: photo URLs are
 * arbitrary and would each need an entry in `images.remotePatterns`, and an
 * unconfigured host makes the optimiser return a 500 instead of firing
 * `onError` — which would defeat the placeholder requirement entirely.
 */
export function MemberAvatar({ src, name }: MemberAvatarProps) {
  // Track which URL failed rather than a boolean, so a changed `src` gets a
  // fresh attempt instead of inheriting a stale failure.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // The card is server-rendered, so a broken photo can finish failing BEFORE
  // React hydrates and attaches onError — in which case the event is missed
  // and the placeholder would never appear. Re-check on mount: an image that
  // reports `complete` with zero natural width has failed to decode.
  useEffect(() => {
    const img = imgRef.current
    if (!img || !src) return
    if (img.complete && img.naturalWidth === 0) setFailedSrc(src)
  }, [src])

  const usePlaceholder = !src || failedSrc === src
  const resolvedSrc = usePlaceholder ? PLACEHOLDER_SRC : src

  return (
    // eslint-disable-next-line @next/next/no-img-element -- see note above
    <img
      ref={imgRef}
      src={resolvedSrc}
      // The placeholder carries no information; the name is already in the
      // adjacent heading, so announcing it twice is noise.
      alt={usePlaceholder ? '' : `Portrait of ${name}`}
      loading="lazy"
      decoding="async"
      onError={() => src && setFailedSrc(src)}
      // object-cover crops to the frame — never stretches or distorts,
      // whatever aspect ratio the source happens to be.
      className="h-full w-full object-cover object-center"
    />
  )
}
