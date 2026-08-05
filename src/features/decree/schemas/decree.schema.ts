import { z } from 'zod'

/** Parses a `/decrees/:uid` segment into its `{ threadId, slug }` parts. */
export const decreeUidSchema = z
  .string()
  .transform((uid) => {
    const separatorIndex = uid.indexOf('-')
    return {
      uid,
      threadId: separatorIndex > 0 ? uid.slice(0, separatorIndex) : '',
      slug: separatorIndex > 0 ? uid.slice(separatorIndex + 1) : uid,
    }
  })
  .pipe(
    z.object({
      uid: z.string().min(1),
      threadId: z.string().regex(/^\d{17,20}$/, 'Identifiant de décret invalide'),
      slug: z.string().min(1, 'Identifiant de décret invalide'),
    })
  )
