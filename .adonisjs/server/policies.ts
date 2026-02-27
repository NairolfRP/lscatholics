export const policies = {
  PostPolicy: () => import('#app/posts/policies/post_policy'),
  CareersJobPostingPolicy: () => import('#app/careers/policies/job_posting_policy'),
  ScheduledEventPolicy: () => import('#app/scheduled_events/policies/scheduled_event_policy'),
  DashboardPolicy: () => import('#app/dashboard/policies/dashboard_policy'),
}

