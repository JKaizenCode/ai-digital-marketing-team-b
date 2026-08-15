import { collection, doc, type CollectionReference, type DocumentData } from 'firebase/firestore'
import { getClientDb } from './client'
import { TEAM_MEMBERS_COLLECTION, type TeamMember, type UserProfile } from '@/types/firestore'

/**
 * Creates a typed Firestore collection reference.
 * Use this factory to add new collections — see docs/FIRESTORE-SCHEMA.md
 */
function typedCollection<T extends DocumentData>(path: string): CollectionReference<T> {
  return collection(getClientDb(), path) as CollectionReference<T>
}

// ── Collections ──────────────────────────────────────────────────────────────
// Add one export per Firestore collection. Keep in sync with:
//   - src/types/firestore.ts
//   - firebase/firestore.rules
//   - docs/FIRESTORE-SCHEMA.md

export function getUsersCollection() {
  return typedCollection<UserProfile>('users')
}

export function userDoc(uid: string) {
  return doc(getUsersCollection(), uid)
}

/**
 * Team members shown on /team.
 *
 * NOTE: the Team Members page reads this collection server-side through the
 * Admin SDK (see src/features/team/actions/team.actions.ts), which bypasses
 * security rules. This client-side reference exists for parity with the
 * boilerplate's collection convention and for any future client-side feature.
 * If you do start reading it from the browser, add a matching rule in
 * firebase/firestore.rules first.
 */
export function getTeamMembersCollection() {
  return typedCollection<TeamMember>(TEAM_MEMBERS_COLLECTION)
}

export function teamMemberDoc(id: string) {
  return doc(getTeamMembersCollection(), id)
}
