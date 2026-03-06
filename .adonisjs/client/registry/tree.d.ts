/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  payment: {
    callback: typeof routes['payment.callback']
  }
  signIn: typeof routes['signIn']
  auth: {
    handleCallback: typeof routes['auth.handle_callback']
    handleDiscordCallback: typeof routes['auth.handle_discord_callback']
  }
  deleteUser: typeof routes['deleteUser']
  logout: typeof routes['logout']
  listCharacters: typeof routes['listCharacters']
  switchCharacter: typeof routes['switchCharacter']
  discord: {
    redirect: typeof routes['discord.redirect']
    unlink: typeof routes['discord.unlink']
  }
  profile: typeof routes['profile']
  dashboard: {
    index: typeof routes['dashboard.index']
    dashboardPosts: {
      index: typeof routes['dashboard.dashboard_posts.index']
      create: typeof routes['dashboard.dashboard_posts.create']
      store: typeof routes['dashboard.dashboard_posts.store']
      show: typeof routes['dashboard.dashboard_posts.show']
      edit: typeof routes['dashboard.dashboard_posts.edit']
      update: typeof routes['dashboard.dashboard_posts.update']
      destroy: typeof routes['dashboard.dashboard_posts.destroy']
    }
    dashboardEvents: {
      index: typeof routes['dashboard.dashboard_events.index']
      create: typeof routes['dashboard.dashboard_events.create']
      store: typeof routes['dashboard.dashboard_events.store']
      show: typeof routes['dashboard.dashboard_events.show']
      edit: typeof routes['dashboard.dashboard_events.edit']
      update: typeof routes['dashboard.dashboard_events.update']
      destroy: typeof routes['dashboard.dashboard_events.destroy']
    }
    dashboardJobs: {
      index: typeof routes['dashboard.dashboard_jobs.index']
      create: typeof routes['dashboard.dashboard_jobs.create']
      store: typeof routes['dashboard.dashboard_jobs.store']
      show: typeof routes['dashboard.dashboard_jobs.show']
      edit: typeof routes['dashboard.dashboard_jobs.edit']
      update: typeof routes['dashboard.dashboard_jobs.update']
      destroy: typeof routes['dashboard.dashboard_jobs.destroy']
    }
    dashboardUsers: {
      index: typeof routes['dashboard.dashboard_users.index']
      create: typeof routes['dashboard.dashboard_users.create']
      store: typeof routes['dashboard.dashboard_users.store']
      show: typeof routes['dashboard.dashboard_users.show']
      edit: typeof routes['dashboard.dashboard_users.edit']
      update: typeof routes['dashboard.dashboard_users.update']
      destroy: typeof routes['dashboard.dashboard_users.destroy']
    }
  }
  home: typeof routes['home']
  contact: typeof routes['contact'] & {
    submit: typeof routes['contact.submit']
  }
  news: {
    index: typeof routes['news.index']
    single: typeof routes['news.single']
  }
  scheduledEvents: {
    index: typeof routes['scheduled_events.index']
  }
  find: {
    events: typeof routes['find.events']
    parishes: typeof routes['find.parishes']
  }
  event: typeof routes['event']
  aboutUs: typeof routes['about-us']
  archbishop: {
    index: typeof routes['archbishop.index']
  }
  departments: {
    index: typeof routes['departments.index']
    single: typeof routes['departments.single']
  }
  services: {
    index: typeof routes['services.index']
    single: typeof routes['services.single']
  }
  donate: {
    index: typeof routes['donate.index']
    submit: typeof routes['donate.submit']
  }
  registerParishioner: {
    index: typeof routes['registerParishioner.index']
    submit: typeof routes['registerParishioner.submit']
  }
  privacy: typeof routes['privacy']
  charities: {
    index: typeof routes['charities.index']
  }
  vocations: typeof routes['vocations']
  jobs: {
    index: typeof routes['jobs.index']
    single: typeof routes['jobs.single']
    application: typeof routes['jobs.application']
    applicationSubmit: typeof routes['jobs.application_submit']
  }
  dailyReadings: typeof routes['dailyReadings']
}
