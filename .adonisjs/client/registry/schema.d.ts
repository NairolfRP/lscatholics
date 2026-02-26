/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput } from '@vinejs/vine/types'

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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payments_controller').default['callback']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['redirectToProvider']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['handleCallback']>>>
    }
  }
  'deleteUser': {
    methods: ["DELETE"]
    pattern: '/api/auth/delete-user'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/delete_user_confirmation').createDeleteUserConfirmationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/delete_user_confirmation').createDeleteUserConfirmationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['deleteUser']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'listCharacters': {
    methods: ["GET","HEAD"]
    pattern: '/api/auth/list-characters'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/characters_controller').default['listCharacters']>>>
    }
  }
  'switchCharacter': {
    methods: ["PATCH"]
    pattern: '/api/auth/current-character'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/characters_controller').default['switchCharacter']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['redirectToDiscord']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['handleDiscordCallback']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['unlinkDiscord']>>>
    }
  }
  'profile': {
    methods: ["GET","HEAD"]
    pattern: '/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_pages_controller').default['index']>>>
    }
  }
  'dashboard.dashboard_articles.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/articles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_articles_controller').default['index']>>>
    }
  }
  'dashboard.dashboard_articles.create': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/articles/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_articles_controller').default['create']>>>
    }
  }
  'dashboard.dashboard_articles.store': {
    methods: ["POST"]
    pattern: '/dashboard/articles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/dashboard_article').createDashboardArticleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/dashboard_article').createDashboardArticleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_articles_controller').default['store']>>>
    }
  }
  'dashboard.dashboard_articles.show': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/articles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_articles_controller').default['show']>>>
    }
  }
  'dashboard.dashboard_articles.edit': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard/articles/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_articles_controller').default['edit']>>>
    }
  }
  'dashboard.dashboard_articles.update': {
    methods: ["PUT","PATCH"]
    pattern: '/dashboard/articles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/dashboard_article').updatedDashboardArticleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/dashboard_article').updatedDashboardArticleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_articles_controller').default['update']>>>
    }
  }
  'dashboard.dashboard_articles.destroy': {
    methods: ["DELETE"]
    pattern: '/dashboard/articles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_articles_controller').default['destroy']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_events_controller').default['index']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_events_controller').default['create']>>>
    }
  }
  'dashboard.dashboard_events.store': {
    methods: ["POST"]
    pattern: '/dashboard/events'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/dashboard_event').createDashboardEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/dashboard_event').createDashboardEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_events_controller').default['store']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_events_controller').default['show']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_events_controller').default['edit']>>>
    }
  }
  'dashboard.dashboard_events.update': {
    methods: ["PUT","PATCH"]
    pattern: '/dashboard/events/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/dashboard_event').updateDashboardEventValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/dashboard_event').updateDashboardEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_events_controller').default['update']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_events_controller').default['destroy']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_jobs_controller').default['index']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_jobs_controller').default['create']>>>
    }
  }
  'dashboard.dashboard_jobs.store': {
    methods: ["POST"]
    pattern: '/dashboard/jobs'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/dashboard_job').createDashboardJobValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/dashboard_job').createDashboardJobValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_jobs_controller').default['store']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_jobs_controller').default['show']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_jobs_controller').default['edit']>>>
    }
  }
  'dashboard.dashboard_jobs.update': {
    methods: ["PUT","PATCH"]
    pattern: '/dashboard/jobs/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/dashboard_job').updatedDashboardJobValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/dashboard_job').updatedDashboardJobValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_jobs_controller').default['update']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_jobs_controller').default['destroy']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/home_controller').default['index']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['index']>>>
    }
  }
  'contact.submit': {
    methods: ["POST"]
    pattern: '/contact'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact_validation').createContactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact_validation').createContactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['submit']>>>
    }
  }
  'news.index': {
    methods: ["GET","HEAD"]
    pattern: '/newsroom'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/news').createNewsSearchParamsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/news_controller').default['index']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/news_controller').default['single']>>>
    }
  }
  'events.index': {
    methods: ["GET","HEAD"]
    pattern: '/find'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['index']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['index']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['single']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/parishes_controller').default['parishes']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/departments_controller').default['index']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/departments_controller').default['single']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/services_controller').default['index']>>>
    }
  }
  'services.single': {
    methods: ["GET","HEAD"]
    pattern: '/services/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/service_slug').createServiceSlugValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/services_controller').default['single']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/donate_controller').default['index']>>>
    }
  }
  'donate.submit': {
    methods: ["POST"]
    pattern: '/donate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/donate').createDonateFormValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/donate').createDonateFormValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/donate_controller').default['submit']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/register_parishioners_controller').default['index']>>>
    }
  }
  'registerParishioner.submit': {
    methods: ["POST"]
    pattern: '/register-parishioner'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/register_parishioner').createRegisterParishionerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/register_parishioner').createRegisterParishionerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/register_parishioners_controller').default['submit']>>>
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
      response: unknown
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/jobs_controller').default['index']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/jobs_controller').default['single']>>>
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
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/job_applications_controller').default['index']>>>
    }
  }
  'jobs.application_submit': {
    methods: ["POST"]
    pattern: '/employment-application/:slug'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/employment_application').createEmploymentApplicationValidator)>>
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/employment_application').createEmploymentApplicationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/job_applications_controller').default['submit']>>>
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
    }
  }
}
