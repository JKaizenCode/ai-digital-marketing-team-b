'use server'

import { requireAuth } from '@/actions/auth.actions'
import { adminDb } from '@/lib/firebase/admin'
import { TEAM_MEMBERS_COLLECTION } from '@/types/firestore'
import type { ActionResult } from '@/types'
import type { TeamMemberView } from '../types'

/**
 * Coerce a Firestore field to a trimmed string.
 *
 * Team member documents are authored by hand, so a field can legitimately be
 * missing, null, or the wrong type. The page must degrade rather than throw.
 */
function toText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Coerce a photo field to a usable URL, or null to trigger the placeholder.
 * An empty string would render as a broken image, so it is normalised away.
 */
function toPhotoURL(value: unknown): string | null {
  const url = toText(value)
  return url.length > 0 ? url : null
}

function toOrder(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER
}

/**
 * Read every team member for the Team Members page.
 *
 * Read via the Admin SDK, which bypasses Firestore security rules — so adding
 * this page required no rules change. Sorting happens in memory rather than
 * via a two-field `orderBy`, which avoids needing a composite index and keeps
 * documents with a missing `order` from disappearing.
 */
export async function getTeamMembers(): Promise<ActionResult<TeamMemberView[]>> {
  await requireAuth()

  try {
    const snapshot = await adminDb.collection(TEAM_MEMBERS_COLLECTION).get()

    const members = snapshot.docs
      .map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          name: toText(data.name),
          role: toText(data.role),
          blurb: toText(data.blurb),
          photoURL: toPhotoURL(data.photoURL),
          order: toOrder(data.order),
        }
      })
      // A document with no name has nothing to identify it — skip rather than
      // render an anonymous card.
      .filter((member) => member.name.length > 0)
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
      .map<TeamMemberView>((member) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        blurb: member.blurb,
        photoURL: member.photoURL,
      }))

    return { success: true, data: members }
  } catch {
    return { success: false, error: 'Unable to load team members right now.' }
  }
}
