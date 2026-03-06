/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'payment.callback': {
    methods: ["GET","HEAD"],
    pattern: '/api/payment/fleeca/callback/:token',
    tokens: [{"old":"/api/payment/fleeca/callback/:token","type":0,"val":"api","end":""},{"old":"/api/payment/fleeca/callback/:token","type":0,"val":"payment","end":""},{"old":"/api/payment/fleeca/callback/:token","type":0,"val":"fleeca","end":""},{"old":"/api/payment/fleeca/callback/:token","type":0,"val":"callback","end":""},{"old":"/api/payment/fleeca/callback/:token","type":1,"val":"token","end":""}],
    types: placeholder as Registry['payment.callback']['types'],
  },
  'signIn': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/redirect/gtaw',
    tokens: [{"old":"/api/auth/redirect/gtaw","type":0,"val":"api","end":""},{"old":"/api/auth/redirect/gtaw","type":0,"val":"auth","end":""},{"old":"/api/auth/redirect/gtaw","type":0,"val":"redirect","end":""},{"old":"/api/auth/redirect/gtaw","type":0,"val":"gtaw","end":""}],
    types: placeholder as Registry['signIn']['types'],
  },
  'auth.handle_callback': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/callback/gtaw',
    tokens: [{"old":"/api/auth/callback/gtaw","type":0,"val":"api","end":""},{"old":"/api/auth/callback/gtaw","type":0,"val":"auth","end":""},{"old":"/api/auth/callback/gtaw","type":0,"val":"callback","end":""},{"old":"/api/auth/callback/gtaw","type":0,"val":"gtaw","end":""}],
    types: placeholder as Registry['auth.handle_callback']['types'],
  },
  'deleteUser': {
    methods: ["DELETE"],
    pattern: '/api/auth/delete-user',
    tokens: [{"old":"/api/auth/delete-user","type":0,"val":"api","end":""},{"old":"/api/auth/delete-user","type":0,"val":"auth","end":""},{"old":"/api/auth/delete-user","type":0,"val":"delete-user","end":""}],
    types: placeholder as Registry['deleteUser']['types'],
  },
  'logout': {
    methods: ["POST"],
    pattern: '/api/auth/logout',
    tokens: [{"old":"/api/auth/logout","type":0,"val":"api","end":""},{"old":"/api/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logout']['types'],
  },
  'listCharacters': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/list-characters',
    tokens: [{"old":"/api/auth/list-characters","type":0,"val":"api","end":""},{"old":"/api/auth/list-characters","type":0,"val":"auth","end":""},{"old":"/api/auth/list-characters","type":0,"val":"list-characters","end":""}],
    types: placeholder as Registry['listCharacters']['types'],
  },
  'switchCharacter': {
    methods: ["PATCH"],
    pattern: '/api/auth/current-character',
    tokens: [{"old":"/api/auth/current-character","type":0,"val":"api","end":""},{"old":"/api/auth/current-character","type":0,"val":"auth","end":""},{"old":"/api/auth/current-character","type":0,"val":"current-character","end":""}],
    types: placeholder as Registry['switchCharacter']['types'],
  },
  'discord.redirect': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/redirect/discord',
    tokens: [{"old":"/api/auth/redirect/discord","type":0,"val":"api","end":""},{"old":"/api/auth/redirect/discord","type":0,"val":"auth","end":""},{"old":"/api/auth/redirect/discord","type":0,"val":"redirect","end":""},{"old":"/api/auth/redirect/discord","type":0,"val":"discord","end":""}],
    types: placeholder as Registry['discord.redirect']['types'],
  },
  'auth.handle_discord_callback': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/callback/discord',
    tokens: [{"old":"/api/auth/callback/discord","type":0,"val":"api","end":""},{"old":"/api/auth/callback/discord","type":0,"val":"auth","end":""},{"old":"/api/auth/callback/discord","type":0,"val":"callback","end":""},{"old":"/api/auth/callback/discord","type":0,"val":"discord","end":""}],
    types: placeholder as Registry['auth.handle_discord_callback']['types'],
  },
  'discord.unlink': {
    methods: ["DELETE"],
    pattern: '/api/auth/unlink/discord',
    tokens: [{"old":"/api/auth/unlink/discord","type":0,"val":"api","end":""},{"old":"/api/auth/unlink/discord","type":0,"val":"auth","end":""},{"old":"/api/auth/unlink/discord","type":0,"val":"unlink","end":""},{"old":"/api/auth/unlink/discord","type":0,"val":"discord","end":""}],
    types: placeholder as Registry['discord.unlink']['types'],
  },
  'profile': {
    methods: ["GET","HEAD"],
    pattern: '/profile',
    tokens: [{"old":"/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile']['types'],
  },
  'dashboard.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard.index']['types'],
  },
  'dashboard.dashboard_posts.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/posts',
    tokens: [{"old":"/dashboard/posts","type":0,"val":"dashboard","end":""},{"old":"/dashboard/posts","type":0,"val":"posts","end":""}],
    types: placeholder as Registry['dashboard.dashboard_posts.index']['types'],
  },
  'dashboard.dashboard_posts.create': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/posts/create',
    tokens: [{"old":"/dashboard/posts/create","type":0,"val":"dashboard","end":""},{"old":"/dashboard/posts/create","type":0,"val":"posts","end":""},{"old":"/dashboard/posts/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['dashboard.dashboard_posts.create']['types'],
  },
  'dashboard.dashboard_posts.store': {
    methods: ["POST"],
    pattern: '/dashboard/posts',
    tokens: [{"old":"/dashboard/posts","type":0,"val":"dashboard","end":""},{"old":"/dashboard/posts","type":0,"val":"posts","end":""}],
    types: placeholder as Registry['dashboard.dashboard_posts.store']['types'],
  },
  'dashboard.dashboard_posts.show': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/posts/:id',
    tokens: [{"old":"/dashboard/posts/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/posts/:id","type":0,"val":"posts","end":""},{"old":"/dashboard/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_posts.show']['types'],
  },
  'dashboard.dashboard_posts.edit': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/posts/:id/edit',
    tokens: [{"old":"/dashboard/posts/:id/edit","type":0,"val":"dashboard","end":""},{"old":"/dashboard/posts/:id/edit","type":0,"val":"posts","end":""},{"old":"/dashboard/posts/:id/edit","type":1,"val":"id","end":""},{"old":"/dashboard/posts/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['dashboard.dashboard_posts.edit']['types'],
  },
  'dashboard.dashboard_posts.update': {
    methods: ["PUT","PATCH"],
    pattern: '/dashboard/posts/:id',
    tokens: [{"old":"/dashboard/posts/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/posts/:id","type":0,"val":"posts","end":""},{"old":"/dashboard/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_posts.update']['types'],
  },
  'dashboard.dashboard_posts.destroy': {
    methods: ["DELETE"],
    pattern: '/dashboard/posts/:id',
    tokens: [{"old":"/dashboard/posts/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/posts/:id","type":0,"val":"posts","end":""},{"old":"/dashboard/posts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_posts.destroy']['types'],
  },
  'dashboard.dashboard_events.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/events',
    tokens: [{"old":"/dashboard/events","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['dashboard.dashboard_events.index']['types'],
  },
  'dashboard.dashboard_events.create': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/events/create',
    tokens: [{"old":"/dashboard/events/create","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/create","type":0,"val":"events","end":""},{"old":"/dashboard/events/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['dashboard.dashboard_events.create']['types'],
  },
  'dashboard.dashboard_events.store': {
    methods: ["POST"],
    pattern: '/dashboard/events',
    tokens: [{"old":"/dashboard/events","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['dashboard.dashboard_events.store']['types'],
  },
  'dashboard.dashboard_events.show': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/events/:id',
    tokens: [{"old":"/dashboard/events/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_events.show']['types'],
  },
  'dashboard.dashboard_events.edit': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/events/:id/edit',
    tokens: [{"old":"/dashboard/events/:id/edit","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id/edit","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id/edit","type":1,"val":"id","end":""},{"old":"/dashboard/events/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['dashboard.dashboard_events.edit']['types'],
  },
  'dashboard.dashboard_events.update': {
    methods: ["PUT","PATCH"],
    pattern: '/dashboard/events/:id',
    tokens: [{"old":"/dashboard/events/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_events.update']['types'],
  },
  'dashboard.dashboard_events.destroy': {
    methods: ["DELETE"],
    pattern: '/dashboard/events/:id',
    tokens: [{"old":"/dashboard/events/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/events/:id","type":0,"val":"events","end":""},{"old":"/dashboard/events/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_events.destroy']['types'],
  },
  'dashboard.dashboard_jobs.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/jobs',
    tokens: [{"old":"/dashboard/jobs","type":0,"val":"dashboard","end":""},{"old":"/dashboard/jobs","type":0,"val":"jobs","end":""}],
    types: placeholder as Registry['dashboard.dashboard_jobs.index']['types'],
  },
  'dashboard.dashboard_jobs.create': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/jobs/create',
    tokens: [{"old":"/dashboard/jobs/create","type":0,"val":"dashboard","end":""},{"old":"/dashboard/jobs/create","type":0,"val":"jobs","end":""},{"old":"/dashboard/jobs/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['dashboard.dashboard_jobs.create']['types'],
  },
  'dashboard.dashboard_jobs.store': {
    methods: ["POST"],
    pattern: '/dashboard/jobs',
    tokens: [{"old":"/dashboard/jobs","type":0,"val":"dashboard","end":""},{"old":"/dashboard/jobs","type":0,"val":"jobs","end":""}],
    types: placeholder as Registry['dashboard.dashboard_jobs.store']['types'],
  },
  'dashboard.dashboard_jobs.show': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/jobs/:id',
    tokens: [{"old":"/dashboard/jobs/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/jobs/:id","type":0,"val":"jobs","end":""},{"old":"/dashboard/jobs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_jobs.show']['types'],
  },
  'dashboard.dashboard_jobs.edit': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/jobs/:id/edit',
    tokens: [{"old":"/dashboard/jobs/:id/edit","type":0,"val":"dashboard","end":""},{"old":"/dashboard/jobs/:id/edit","type":0,"val":"jobs","end":""},{"old":"/dashboard/jobs/:id/edit","type":1,"val":"id","end":""},{"old":"/dashboard/jobs/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['dashboard.dashboard_jobs.edit']['types'],
  },
  'dashboard.dashboard_jobs.update': {
    methods: ["PUT","PATCH"],
    pattern: '/dashboard/jobs/:id',
    tokens: [{"old":"/dashboard/jobs/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/jobs/:id","type":0,"val":"jobs","end":""},{"old":"/dashboard/jobs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_jobs.update']['types'],
  },
  'dashboard.dashboard_jobs.destroy': {
    methods: ["DELETE"],
    pattern: '/dashboard/jobs/:id',
    tokens: [{"old":"/dashboard/jobs/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/jobs/:id","type":0,"val":"jobs","end":""},{"old":"/dashboard/jobs/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_jobs.destroy']['types'],
  },
  'dashboard.dashboard_users.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/users',
    tokens: [{"old":"/dashboard/users","type":0,"val":"dashboard","end":""},{"old":"/dashboard/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['dashboard.dashboard_users.index']['types'],
  },
  'dashboard.dashboard_users.create': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/users/create',
    tokens: [{"old":"/dashboard/users/create","type":0,"val":"dashboard","end":""},{"old":"/dashboard/users/create","type":0,"val":"users","end":""},{"old":"/dashboard/users/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['dashboard.dashboard_users.create']['types'],
  },
  'dashboard.dashboard_users.store': {
    methods: ["POST"],
    pattern: '/dashboard/users',
    tokens: [{"old":"/dashboard/users","type":0,"val":"dashboard","end":""},{"old":"/dashboard/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['dashboard.dashboard_users.store']['types'],
  },
  'dashboard.dashboard_users.show': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/users/:id',
    tokens: [{"old":"/dashboard/users/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/users/:id","type":0,"val":"users","end":""},{"old":"/dashboard/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_users.show']['types'],
  },
  'dashboard.dashboard_users.edit': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard/users/:id/edit',
    tokens: [{"old":"/dashboard/users/:id/edit","type":0,"val":"dashboard","end":""},{"old":"/dashboard/users/:id/edit","type":0,"val":"users","end":""},{"old":"/dashboard/users/:id/edit","type":1,"val":"id","end":""},{"old":"/dashboard/users/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['dashboard.dashboard_users.edit']['types'],
  },
  'dashboard.dashboard_users.update': {
    methods: ["PUT","PATCH"],
    pattern: '/dashboard/users/:id',
    tokens: [{"old":"/dashboard/users/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/users/:id","type":0,"val":"users","end":""},{"old":"/dashboard/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_users.update']['types'],
  },
  'dashboard.dashboard_users.destroy': {
    methods: ["DELETE"],
    pattern: '/dashboard/users/:id',
    tokens: [{"old":"/dashboard/users/:id","type":0,"val":"dashboard","end":""},{"old":"/dashboard/users/:id","type":0,"val":"users","end":""},{"old":"/dashboard/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['dashboard.dashboard_users.destroy']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'contact': {
    methods: ["GET","HEAD"],
    pattern: '/contact',
    tokens: [{"old":"/contact","type":0,"val":"contact","end":""}],
    types: placeholder as Registry['contact']['types'],
  },
  'contact.submit': {
    methods: ["POST"],
    pattern: '/contact',
    tokens: [{"old":"/contact","type":0,"val":"contact","end":""}],
    types: placeholder as Registry['contact.submit']['types'],
  },
  'news.index': {
    methods: ["GET","HEAD"],
    pattern: '/newsroom',
    tokens: [{"old":"/newsroom","type":0,"val":"newsroom","end":""}],
    types: placeholder as Registry['news.index']['types'],
  },
  'news.single': {
    methods: ["GET","HEAD"],
    pattern: '/newsroom/:slug',
    tokens: [{"old":"/newsroom/:slug","type":0,"val":"newsroom","end":""},{"old":"/newsroom/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['news.single']['types'],
  },
  'scheduled_events.index': {
    methods: ["GET","HEAD"],
    pattern: '/find',
    tokens: [{"old":"/find","type":0,"val":"find","end":""}],
    types: placeholder as Registry['scheduled_events.index']['types'],
  },
  'find.events': {
    methods: ["GET","HEAD"],
    pattern: '/find/events',
    tokens: [{"old":"/find/events","type":0,"val":"find","end":""},{"old":"/find/events","type":0,"val":"events","end":""}],
    types: placeholder as Registry['find.events']['types'],
  },
  'event': {
    methods: ["GET","HEAD"],
    pattern: '/event/:slug',
    tokens: [{"old":"/event/:slug","type":0,"val":"event","end":""},{"old":"/event/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['event']['types'],
  },
  'find.parishes': {
    methods: ["GET","HEAD"],
    pattern: '/find/parishes',
    tokens: [{"old":"/find/parishes","type":0,"val":"find","end":""},{"old":"/find/parishes","type":0,"val":"parishes","end":""}],
    types: placeholder as Registry['find.parishes']['types'],
  },
  'about-us': {
    methods: ["GET","HEAD"],
    pattern: '/about',
    tokens: [{"old":"/about","type":0,"val":"about","end":""}],
    types: placeholder as Registry['about-us']['types'],
  },
  'archbishop.index': {
    methods: ["GET","HEAD"],
    pattern: '/archbishop',
    tokens: [{"old":"/archbishop","type":0,"val":"archbishop","end":""}],
    types: placeholder as Registry['archbishop.index']['types'],
  },
  'departments.index': {
    methods: ["GET","HEAD"],
    pattern: '/departments',
    tokens: [{"old":"/departments","type":0,"val":"departments","end":""}],
    types: placeholder as Registry['departments.index']['types'],
  },
  'departments.single': {
    methods: ["GET","HEAD"],
    pattern: '/department/:slug',
    tokens: [{"old":"/department/:slug","type":0,"val":"department","end":""},{"old":"/department/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['departments.single']['types'],
  },
  'services.index': {
    methods: ["GET","HEAD"],
    pattern: '/services',
    tokens: [{"old":"/services","type":0,"val":"services","end":""}],
    types: placeholder as Registry['services.index']['types'],
  },
  'services.single': {
    methods: ["GET","HEAD"],
    pattern: '/services/:slug',
    tokens: [{"old":"/services/:slug","type":0,"val":"services","end":""},{"old":"/services/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['services.single']['types'],
  },
  'donate.index': {
    methods: ["GET","HEAD"],
    pattern: '/donate',
    tokens: [{"old":"/donate","type":0,"val":"donate","end":""}],
    types: placeholder as Registry['donate.index']['types'],
  },
  'donate.submit': {
    methods: ["POST"],
    pattern: '/donate',
    tokens: [{"old":"/donate","type":0,"val":"donate","end":""}],
    types: placeholder as Registry['donate.submit']['types'],
  },
  'registerParishioner.index': {
    methods: ["GET","HEAD"],
    pattern: '/register-parishioner',
    tokens: [{"old":"/register-parishioner","type":0,"val":"register-parishioner","end":""}],
    types: placeholder as Registry['registerParishioner.index']['types'],
  },
  'registerParishioner.submit': {
    methods: ["POST"],
    pattern: '/register-parishioner',
    tokens: [{"old":"/register-parishioner","type":0,"val":"register-parishioner","end":""}],
    types: placeholder as Registry['registerParishioner.submit']['types'],
  },
  'privacy': {
    methods: ["GET","HEAD"],
    pattern: '/privacy',
    tokens: [{"old":"/privacy","type":0,"val":"privacy","end":""}],
    types: placeholder as Registry['privacy']['types'],
  },
  'charities.index': {
    methods: ["GET","HEAD"],
    pattern: '/catholic-charities',
    tokens: [{"old":"/catholic-charities","type":0,"val":"catholic-charities","end":""}],
    types: placeholder as Registry['charities.index']['types'],
  },
  'vocations': {
    methods: ["GET","HEAD"],
    pattern: '/vocations',
    tokens: [{"old":"/vocations","type":0,"val":"vocations","end":""}],
    types: placeholder as Registry['vocations']['types'],
  },
  'jobs.index': {
    methods: ["GET","HEAD"],
    pattern: '/jobs',
    tokens: [{"old":"/jobs","type":0,"val":"jobs","end":""}],
    types: placeholder as Registry['jobs.index']['types'],
  },
  'jobs.single': {
    methods: ["GET","HEAD"],
    pattern: '/jobs/:slug',
    tokens: [{"old":"/jobs/:slug","type":0,"val":"jobs","end":""},{"old":"/jobs/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['jobs.single']['types'],
  },
  'jobs.application': {
    methods: ["GET","HEAD"],
    pattern: '/employment-application/:slug',
    tokens: [{"old":"/employment-application/:slug","type":0,"val":"employment-application","end":""},{"old":"/employment-application/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['jobs.application']['types'],
  },
  'jobs.application_submit': {
    methods: ["POST"],
    pattern: '/employment-application/:slug',
    tokens: [{"old":"/employment-application/:slug","type":0,"val":"employment-application","end":""},{"old":"/employment-application/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['jobs.application_submit']['types'],
  },
  'dailyReadings': {
    methods: ["GET","HEAD"],
    pattern: '/daily-readings',
    tokens: [{"old":"/daily-readings","type":0,"val":"daily-readings","end":""}],
    types: placeholder as Registry['dailyReadings']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
