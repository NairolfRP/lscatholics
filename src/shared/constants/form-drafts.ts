export const INCIDENT_REPORT_DRAFT_STORAGE_KEY = 'incident-report-draft'
export const JOB_APPLICATION_DRAFT_STORAGE_KEY = 'job-application-draft'
export const CLERGY_APPLICATION_DRAFT_STORAGE_KEY = 'clergy-application-draft'

/**
 * Every form draft persisted in local storage. The user settings rely on this
 * registry to list and clear them.
 */
export const FORM_DRAFTS = [
  {
    storageKey: INCIDENT_REPORT_DRAFT_STORAGE_KEY,
    label: 'Rapport d’incident',
  },
  {
    storageKey: JOB_APPLICATION_DRAFT_STORAGE_KEY,
    label: 'Candidature (emploi ou spontanée)',
  },
  {
    storageKey: CLERGY_APPLICATION_DRAFT_STORAGE_KEY,
    label: 'Candidature pour le clergé',
  },
] as const
