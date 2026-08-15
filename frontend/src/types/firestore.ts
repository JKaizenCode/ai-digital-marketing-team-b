import type { Timestamp } from 'firebase/firestore'

/**
 * Firestore collection type definitions.
 *
 * Keep in sync with:
 *   - src/lib/firebase/firestore.ts  (typed collection exports)
 *   - firebase/firestore.rules       (security rules)
 *   - docs/FIRESTORE-SCHEMA.md       (schema documentation)
 *
 * When adding a new collection, use the /firebase-collection skill.
 */

export interface UserProfile {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  role: 'user'
  createdAt: Timestamp
  updatedAt: Timestamp
  _schemaVersion: 1
}

export type CreateUserProfileInput = Omit<UserProfile, 'createdAt' | 'updatedAt'>

/**
 * A member of the team shown on /team.
 *
 * Additive — this collection is independent of `users`. A team member is
 * editorial content about a person, not an authenticated account, so the two
 * are intentionally not joined.
 *
 * `photoURL` is nullable: the UI falls back to the approved placeholder image
 * when it is null or when the image fails to load.
 */
export interface TeamMember {
  name: string
  role: string
  blurb: string
  photoURL: string | null
  /** Ascending display order. Ties fall back to name. */
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
  _schemaVersion: 1
}

export type CreateTeamMemberInput = Omit<TeamMember, 'createdAt' | 'updatedAt'>

/**
 * Collection path, declared here rather than in lib/firebase/firestore.ts so
 * that server-side code can import it without pulling in the Firebase *client*
 * SDK. This module is type-only at runtime apart from these constants.
 */
export const TEAM_MEMBERS_COLLECTION = 'teamMembers'
