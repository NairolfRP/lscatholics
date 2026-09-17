import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, (r) => ({
  accounts: {
    user: r.one.users({
      from: r.accounts.userId,
      to: r.users.id,
    }),
  },
  users: {
    accounts: r.many.accounts(),
    sessions: r.many.sessions(),
    churchEvents: r.many.churchEvents(),
    posts: r.many.posts(),
    jobPostings: r.many.jobPostings(),
  },
  sessions: {
    user: r.one.users({
      from: r.sessions.userId,
      to: r.users.id,
    }),
  },

  churchEvents: {
    author: r.one.users({
      from: r.churchEvents.authorId,
      to: r.users.id,
    }),
  },
  jobPostings: {
    author: r.one.users({
      from: r.jobPostings.authorId,
      to: r.users.id,
    }),
  },
  posts: {
    author: r.one.users({
      from: r.posts.authorId,
      to: r.users.id,
    }),
  },
}))
