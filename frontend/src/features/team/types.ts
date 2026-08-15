/**
 * View model for the Team Members page.
 *
 * Firestore `Timestamp` objects are not serialisable across the server/client
 * boundary, so the server action projects `TeamMember` down to this plain
 * shape before returning it. Keep it free of anything non-serialisable.
 *
 * See src/types/firestore.ts for the stored document shape.
 */
export interface TeamMemberView {
  /** Firestore document id. */
  id: string
  name: string
  role: string
  blurb: string
  /** Null when no photo is set — the card falls back to the placeholder. */
  photoURL: string | null
}
