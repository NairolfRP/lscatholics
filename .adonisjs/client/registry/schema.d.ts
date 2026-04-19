/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'payment.callback': {
    methods: ["GET","HEAD"]
    pattern: '/api/payment/fleeca/callback/:token'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { token: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/billing/controllers/payments_controller').default['callback']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/billing/controllers/payments_controller').default['callback']>>>
    }
  }
  'signIn': {
    methods: ["GET","HEAD"]
    pattern: '/api/auth/redirect/gtaw'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['redirectToProvider']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['redirectToProvider']>>>
    }
  }
  'auth.handle_callback': {
    methods: ["GET","HEAD"]
    pattern: '/api/auth/callback/gtaw'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['handleCallback']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['handleCallback']>>>
    }
  }
  'logout': {
    methods: ["POST"]
    pattern: '/api/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['logout']>>>
    }
  }
  'discord.redirect': {
    methods: ["GET","HEAD"]
    pattern: '/api/auth/redirect/discord'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['redirectToDiscord']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['redirectToDiscord']>>>
    }
  }
  'auth.handle_discord_callback': {
    methods: ["GET","HEAD"]
    pattern: '/api/auth/callback/discord'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['handleDiscordCallback']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['handleDiscordCallback']>>>
    }
  }
  'discord.unlink': {
    methods: ["DELETE"]
    pattern: '/api/auth/unlink/discord'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['unlinkDiscord']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/auth/controllers/auth_controller').default['unlinkDiscord']>>>
    }
  }
  'account.settings': {
    methods: ["GET","HEAD"]
    pattern: '/account/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/account_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/account_controller').default['edit']>>>
    }
  }
  'account.delete': {
    methods: ["DELETE"]
    pattern: '/account/delete'
    types: {
      body: ExtractBody<InferInput<(typeof import('#users/validators/delete_user_confirmation').createDeleteUserConfirmationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#users/validators/delete_user_confirmation').createDeleteUserConfirmationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/account_controller').default['delete']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/account_controller').default['delete']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'characters.list': {
    methods: ["GET","HEAD"]
    pattern: '/user/characters'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/characters/controllers/characters_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/characters/controllers/characters_controller').default['index']>>>
    }
  }
  'characters.current': {
    methods: ["PATCH"]
    pattern: '/user/characters/current'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/characters/controllers/characters_controller').default['updateCurrent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/characters/controllers/characters_controller').default['updateCurrent']>>>
    }
  }
  'dashboard.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/dashboard/controllers/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/dashboard/controllers/dashboard_controller').default['index']>>>
    }
  }
  'dashboard.dashboard_posts.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/posts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['index']>>>
    }
  }
  'dashboard.dashboard_posts.create': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/posts/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['create']>>>
    }
  }
  'dashboard.dashboard_posts.store': {
    methods: ["POST"]
    pattern: '/dashboard/posts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#posts/validators/dashboard_post').createDashboardPostValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#posts/validators/dashboard_post').createDashboardPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.dashboard_posts.show': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/posts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['show']>>>
    }
  }
  'dashboard.dashboard_posts.edit': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/posts/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['edit']>>>
    }
  }
  'dashboard.dashboard_posts.update': {
    methods: ["PUT","PATCH"]
    pattern: '/dashboard/posts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#posts/validators/dashboard_post').updatedDashboardPostValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#posts/validators/dashboard_post').updatedDashboardPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.dashboard_posts.destroy': {
    methods: ["DELETE"]
    pattern: '/dashboard/posts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/posts/controllers/dashboard_posts_controller').default['destroy']>>>
    }
  }
  'dashboard.dashboard_events.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['index']>>>
    }
  }
  'dashboard.dashboard_events.create': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/events/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['create']>>>
    }
  }
  'dashboard.dashboard_events.store': {
    methods: ["POST"]
    pattern: '/dashboard/events'
    types: {
      body: ExtractBody<InferInput<(typeof import('#scheduled_events/validators/dashboard_scheduled_event').createDashboardScheduledEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#scheduled_events/validators/dashboard_scheduled_event').createDashboardScheduledEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.dashboard_events.show': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/events/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['show']>>>
    }
  }
  'dashboard.dashboard_events.edit': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/events/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['edit']>>>
    }
  }
  'dashboard.dashboard_events.update': {
    methods: ["PUT","PATCH"]
    pattern: '/dashboard/events/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#scheduled_events/validators/dashboard_scheduled_event').updateDashboardScheduledEventValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#scheduled_events/validators/dashboard_scheduled_event').updateDashboardScheduledEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.dashboard_events.destroy': {
    methods: ["DELETE"]
    pattern: '/dashboard/events/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/dashboard_scheduled_events_controller').default['destroy']>>>
    }
  }
  'dashboard.dashboard_jobs.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/jobs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['index']>>>
    }
  }
  'dashboard.dashboard_jobs.create': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/jobs/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['create']>>>
    }
  }
  'dashboard.dashboard_jobs.store': {
    methods: ["POST"]
    pattern: '/dashboard/jobs'
    types: {
      body: ExtractBody<InferInput<(typeof import('#careers/validators/dashboard_job_posting').createDashboardJobPostingValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#careers/validators/dashboard_job_posting').createDashboardJobPostingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.dashboard_jobs.show': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/jobs/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['show']>>>
    }
  }
  'dashboard.dashboard_jobs.edit': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/jobs/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['edit']>>>
    }
  }
  'dashboard.dashboard_jobs.update': {
    methods: ["PUT","PATCH"]
    pattern: '/dashboard/jobs/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#careers/validators/dashboard_job_posting').updatedDashboardJobPostingValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#careers/validators/dashboard_job_posting').updatedDashboardJobPostingValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.dashboard_jobs.destroy': {
    methods: ["DELETE"]
    pattern: '/dashboard/jobs/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/dashboard_job_postings_controller').default['destroy']>>>
    }
  }
  'dashboard.dashboard_users.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['index']>>>
    }
  }
  'dashboard.dashboard_users.create': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/users/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['create']>>>
    }
  }
  'dashboard.dashboard_users.store': {
    methods: ["POST"]
    pattern: '/dashboard/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['store']>>>
    }
  }
  'dashboard.dashboard_users.show': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['show']>>>
    }
  }
  'dashboard.dashboard_users.edit': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/users/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['edit']>>>
    }
  }
  'dashboard.dashboard_users.update': {
    methods: ["PUT","PATCH"]
    pattern: '/dashboard/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#users/validators/dashboard_users').updateDashboardUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#users/validators/dashboard_users').updateDashboardUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dashboard.dashboard_users.destroy': {
    methods: ["DELETE"]
    pattern: '/dashboard/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/users/controllers/dashboard_users_controller').default['destroy']>>>
    }
  }
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/home_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/home_controller').default['index']>>>
    }
  }
  'contact': {
    methods: ["GET","HEAD"]
    pattern: '/contact'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/contact_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/contact_controller').default['index']>>>
    }
  }
  'contact.submit': {
    methods: ["POST"]
    pattern: '/contact'
    types: {
      body: ExtractBody<InferInput<(typeof import('#pages/validators/contact_validation').createContactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#pages/validators/contact_validation').createContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/contact_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/contact_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'news.index': {
    methods: ["GET","HEAD"]
    pattern: '/newsroom'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#posts/validators/post').createPostSearchParamsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/posts/controllers/posts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/posts/controllers/posts_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'news.single': {
    methods: ["GET","HEAD"]
    pattern: '/newsroom/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/posts/controllers/posts_controller').default['single']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/posts/controllers/posts_controller').default['single']>>>
    }
  }
  'scheduled_events.index': {
    methods: ["GET","HEAD"]
    pattern: '/find'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/scheduled_events_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/scheduled_events_controller').default['index']>>>
    }
  }
  'find.events': {
    methods: ["GET","HEAD"]
    pattern: '/find/events'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/scheduled_events_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/scheduled_events_controller').default['index']>>>
    }
  }
  'event': {
    methods: ["GET","HEAD"]
    pattern: '/event/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/scheduled_events_controller').default['single']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/scheduled_events/controllers/scheduled_events_controller').default['single']>>>
    }
  }
  'find.parishes': {
    methods: ["GET","HEAD"]
    pattern: '/find/parishes'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/parishes_controller').default['parishes']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/parishes_controller').default['parishes']>>>
    }
  }
  'about-us': {
    methods: ["GET","HEAD"]
    pattern: '/about'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'archbishop.index': {
    methods: ["GET","HEAD"]
    pattern: '/archbishop'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'departments.index': {
    methods: ["GET","HEAD"]
    pattern: '/departments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/departments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/departments_controller').default['index']>>>
    }
  }
  'departments.single': {
    methods: ["GET","HEAD"]
    pattern: '/department/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/departments_controller').default['single']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/departments_controller').default['single']>>>
    }
  }
  'services.index': {
    methods: ["GET","HEAD"]
    pattern: '/services'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/services_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/services_controller').default['index']>>>
    }
  }
  'services.single': {
    methods: ["GET","HEAD"]
    pattern: '/services/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#pages/validators/service_slug').createServiceSlugValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/services_controller').default['single']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/services_controller').default['single']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'donate.index': {
    methods: ["GET","HEAD"]
    pattern: '/donate'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/donate/controllers/donate_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/donate/controllers/donate_controller').default['index']>>>
    }
  }
  'donate.submit': {
    methods: ["POST"]
    pattern: '/donate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#donate/validators/donate').createDonateFormValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#donate/validators/donate').createDonateFormValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/donate/controllers/donate_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/donate/controllers/donate_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'registerParishioner.index': {
    methods: ["GET","HEAD"]
    pattern: '/register-parishioner'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/register_parishioners_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/register_parishioners_controller').default['index']>>>
    }
  }
  'registerParishioner.submit': {
    methods: ["POST"]
    pattern: '/register-parishioner'
    types: {
      body: ExtractBody<InferInput<(typeof import('#pages/validators/register_parishioner').createRegisterParishionerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#pages/validators/register_parishioner').createRegisterParishionerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/register_parishioners_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/register_parishioners_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'privacy': {
    methods: ["GET","HEAD"]
    pattern: '/privacy'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'charities.index': {
    methods: ["GET","HEAD"]
    pattern: '/catholic-charities'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/charities_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/charities_controller').default['index']>>>
    }
  }
  'charities.program': {
    methods: ["GET","HEAD"]
    pattern: '/catholic-charities/program/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/charities_controller').default['showProgram']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/charities_controller').default['showProgram']>>>
    }
  }
  'vocations': {
    methods: ["GET","HEAD"]
    pattern: '/vocations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'jobs.index': {
    methods: ["GET","HEAD"]
    pattern: '/jobs'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/job_postings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/job_postings_controller').default['index']>>>
    }
  }
  'jobs.single': {
    methods: ["GET","HEAD"]
    pattern: '/jobs/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/job_postings_controller').default['single']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/job_postings_controller').default['single']>>>
    }
  }
  'jobs.application': {
    methods: ["GET","HEAD"]
    pattern: '/employment-application/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/job_applications_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/job_applications_controller').default['index']>>>
    }
  }
  'jobs.application_submit': {
    methods: ["POST"]
    pattern: '/employment-application/:slug'
    types: {
      body: ExtractBody<InferInput<(typeof import('#careers/validators/employment_application').createEmploymentApplicationValidator)>>
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#careers/validators/employment_application').createEmploymentApplicationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/careers/controllers/job_applications_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/careers/controllers/job_applications_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'dailyReadings': {
    methods: ["GET","HEAD"]
    pattern: '/daily-readings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'decrees.index': {
    methods: ["GET","HEAD"]
    pattern: '/decrees'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/decrees_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/decrees_controller').default['index']>>>
    }
  }
  'decrees.single': {
    methods: ["GET","HEAD"]
    pattern: '/decrees/:uid'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { uid: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/decrees_controller').default['single']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/decrees_controller').default['single']>>>
    }
  }
  'volunteers.index': {
    methods: ["GET","HEAD"]
    pattern: '/volunteers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/volunteers_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/volunteers_controller').default['index']>>>
    }
  }
  'volunteers.submit': {
    methods: ["POST"]
    pattern: '/volunteers'
    types: {
      body: ExtractBody<InferInput<(typeof import('#pages/validators/volunteer_application').createVolunteerApplicationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#pages/validators/volunteer_application').createVolunteerApplicationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#app/pages/controllers/volunteers_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#app/pages/controllers/volunteers_controller').default['submit']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
}
