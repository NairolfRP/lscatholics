import type { CONTACT_SUBJECT } from '#/features/contact/constants/contact-subjects'

export type ContactSubject = (typeof CONTACT_SUBJECT)[keyof typeof CONTACT_SUBJECT]
