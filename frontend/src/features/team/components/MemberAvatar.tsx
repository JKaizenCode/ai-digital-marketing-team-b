'use client'

import { useEffect, useRef, useState } from 'react'

/** The approved placeholder, used when a photo is absent or fails to load. */
export const PLACEHOLDER_SRC = '/images/team-placeholder.svg'

interface MemberAvatarProps {
  /** Photo URL, or null when the member has no photo set. */
  src: string | null
  /** Used for alt text and local image lookup. */
  name: string
}

/**
 * Team member portrait with hard-coded local images and a runtime fallback.
 *
 * Local images are stored in:
 *   frontend/public/images/
 *
 * The existing image dimensions and object-cover styling are preserved.
 */
export function MemberAvatar({ src, name }: MemberAvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const localImages: Record<string, string> = {
    anthony: '/images/Anthony.png',
    arnav: '/images/Arnav.png',
    chungheng: '/images/Chunghend.png',
    jeron: '/images/Jeron.png',
    minh: '/images/Minh.png',
  }

  const normalizedName = name.trim().toLowerCase()

  const matchedName = Object.keys(localImages).find((key) =>
    normalizedName.startsWith(key)
  )

  const localSrc = matchedName ? localImages[matchedName] : undefined

  const usePlaceholder = !localSrc || failedSrc === localSrc
  const resolvedSrc = usePlaceholder ? PLACEHOLDER_SRC : localSrc

  useEffect(() => {
    const img = imgRef.current

    if (!img || !localSrc) return

    if (img.complete && img.naturalWidth === 0) {
      setFailedSrc(localSrc)
    }
  }, [localSrc])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={resolvedSrc}
      alt={usePlaceholder ? '' : `Portrait of ${name}`}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (localSrc) {
          setFailedSrc(localSrc)
        }
      }}
      className="h-full w-full object-cover object-center"
    />
  )
}