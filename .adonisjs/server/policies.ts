export const policies = {
  CareersJobPostingPolicy: () => import('#app/careers/policies/job_posting_policy'),
  DashboardPolicy: () => import('#app/dashboard/policies/dashboard_policy'),
  PostPolicy: () => import('#app/posts/policies/post_policy'),
  ScheduledEventPolicy: () => import('#app/scheduled_events/policies/scheduled_event_policy'),
  UserPolicy: () => import('#app/users/policies/user_policy'),
}

