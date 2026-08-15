// @ts-check
/**
 * Seed the `teamMembers` Firestore collection.
 *
 * Usage (from frontend/):
 *   node --env-file=.env.local scripts/seed-team.mjs
 *   node --env-file=.env.local scripts/seed-team.mjs --edge-cases
 *   node --env-file=.env.local scripts/seed-team.mjs --clear
 *
 * Writes use fixed document ids, so re-running updates in place rather than
 * creating duplicates.
 *
 * NOTE ON PHOTOS: every seeded member ships with `photoURL: null`, which makes
 * the approved placeholder render. Replace those with real Firebase Storage
 * (or other https) URLs once you have the team's photos — no code change is
 * needed, the card picks them up automatically.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const COLLECTION = 'teamMembers'

/** Real team entries — edit these to match your team. */
const TEAM = [
  {
    id: 'member-01',
    name: 'Jeron Rinon',
    role: 'Project Manager',
    blurb:
      'Leads project planning, coordination, and delivery oversight across the team.',
    photoURL: null,
    order: 10,
  },
  {
    id: 'member-02',
    name: 'Chungheng Vong',
    role: 'UX Designer',
    blurb:
      'Designs user experiences, wireframes, and interface decisions to align the product with user needs.',
    photoURL: null,
    order: 20,
  },
  {
    id: 'member-03',
    name: 'Anthony Phan',
    role: 'Business Analyst',
    blurb:
      'Translates business requirements into clear scope, analysis, and product direction for the team.',
    photoURL: null,
    order: 30,
  },
  {
    id: 'member-04',
    name: 'Arnav Jain',
    role: 'Developer',
    blurb:
      'Builds and maintains the front-end application and core user-facing functionality.',
    photoURL: null,
    order: 40,
  },
  {
    id: 'member-05',
    name: 'Minh Cuong Vu',
    role: 'Developer',
    blurb:
      'Contributes to application development and implementation across the project.',
    photoURL: null,
    order: 50,
  },
]

/**
 * Optional fixtures that exercise the edge cases in spec §8 — useful for
 * screenshots and for the placeholder / long-text states in §10.
 * Seed them with --edge-cases, and remove them before handover.
 */
const EDGE_CASES = [
  {
    id: 'edge-broken-photo',
    name: 'Broken Photo Example',
    role: 'Demonstrates the placeholder fallback',
    blurb:
      'This record points at a URL that will never resolve, so the onError handler swaps in the approved placeholder image.',
    photoURL: 'https://example.invalid/this-image-does-not-exist.jpg',
    order: 900,
  },
  {
    id: 'edge-long-text',
    name: 'Bartholomew Fitzwilliam-Montgomery Vandersteen III',
    role: 'Senior Principal Lead Coordinator of Interdepartmental Strategy and Client Relations',
    blurb:
      'A deliberately long blurb used to confirm that text wraps within its content area without clipping or overlapping neighbouring elements. It keeps going well past the point any real blurb would, across several lines, so that the card can be checked at both desktop and mobile widths. It also includes an unbroken string — Supercalifragilisticexpialidocious — to confirm that word breaking keeps long tokens inside the card rather than forcing horizontal overflow.',
    photoURL: null,
    order: 910,
  },
]

function getDb() {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64
  if (!key) {
    console.error(
      'FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 is not set.\n' +
        'Run with: node --env-file=.env.local scripts/seed-team.mjs'
    )
    process.exit(1)
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: cert(JSON.parse(Buffer.from(key, 'base64').toString('utf8'))),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
  }

  return getFirestore()
}

async function clear(db) {
  const snapshot = await db.collection(COLLECTION).get()
  if (snapshot.empty) {
    console.log(`No documents in ${COLLECTION}.`)
    return
  }
  const batch = db.batch()
  snapshot.docs.forEach((doc) => batch.delete(doc.ref))
  await batch.commit()
  console.log(`Deleted ${snapshot.size} document(s) from ${COLLECTION}.`)
}

async function seed(db, records) {
  const batch = db.batch()

  for (const { id, ...fields } of records) {
    batch.set(
      db.collection(COLLECTION).doc(id),
      {
        ...fields,
        _schemaVersion: 1,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    )
  }

  await batch.commit()
  console.log(`Seeded ${records.length} document(s) into ${COLLECTION}.`)
  records.forEach((r) => console.log(`  • ${r.id}  ${r.name}`))
}

async function main() {
  const db = getDb()
  const args = process.argv.slice(2)

  if (args.includes('--clear')) {
    await clear(db)
    return
  }

  const records = args.includes('--edge-cases') ? [...TEAM, ...EDGE_CASES] : TEAM
  await seed(db, records)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
