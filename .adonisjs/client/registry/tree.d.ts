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
    dashboardArticles: {
      index: typeof routes['dashboard.dashboard_articles.index']
      create: typeof routes['dashboard.dashboard_articles.create']
      store: typeof routes['dashboard.dashboard_articles.store']
      show: typeof routes['dashboard.dashboard_articles.show']
      edit: typeof routes['dashboard.dashboard_articles.edit']
      update: typeof routes['dashboard.dashboard_articles.update']
      destroy: typeof routes['dashboard.dashboard_articles.destroy']
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
  }
  home: typeof routes['home']
  contact: typeof routes['contact'] & {
    submit: typeof routes['contact.submit']
  }
  news: {
    index: typeof routes['news.index']
    single: typeof routes['news.single']
  }
  events: {
    index: typeof routes['events.index']
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
