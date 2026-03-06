import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'payment.callback': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'signIn': { paramsTuple?: []; params?: {} }
    'auth.handle_callback': { paramsTuple?: []; params?: {} }
    'deleteUser': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'listCharacters': { paramsTuple?: []; params?: {} }
    'switchCharacter': { paramsTuple?: []; params?: {} }
    'discord.redirect': { paramsTuple?: []; params?: {} }
    'auth.handle_discord_callback': { paramsTuple?: []; params?: {} }
    'discord.unlink': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.store': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_posts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_events.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_events.store': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_events.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_jobs.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_jobs.store': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_jobs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_users.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_users.store': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
    'contact.submit': { paramsTuple?: []; params?: {} }
    'news.index': { paramsTuple?: []; params?: {} }
    'news.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'scheduled_events.index': { paramsTuple?: []; params?: {} }
    'find.events': { paramsTuple?: []; params?: {} }
    'event': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'find.parishes': { paramsTuple?: []; params?: {} }
    'about-us': { paramsTuple?: []; params?: {} }
    'archbishop.index': { paramsTuple?: []; params?: {} }
    'departments.index': { paramsTuple?: []; params?: {} }
    'departments.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'services.index': { paramsTuple?: []; params?: {} }
    'services.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'donate.index': { paramsTuple?: []; params?: {} }
    'donate.submit': { paramsTuple?: []; params?: {} }
    'registerParishioner.index': { paramsTuple?: []; params?: {} }
    'registerParishioner.submit': { paramsTuple?: []; params?: {} }
    'privacy': { paramsTuple?: []; params?: {} }
    'charities.index': { paramsTuple?: []; params?: {} }
    'vocations': { paramsTuple?: []; params?: {} }
    'jobs.index': { paramsTuple?: []; params?: {} }
    'jobs.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'jobs.application': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'jobs.application_submit': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'dailyReadings': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'payment.callback': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'signIn': { paramsTuple?: []; params?: {} }
    'auth.handle_callback': { paramsTuple?: []; params?: {} }
    'listCharacters': { paramsTuple?: []; params?: {} }
    'discord.redirect': { paramsTuple?: []; params?: {} }
    'auth.handle_discord_callback': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_posts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_events.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_events.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_jobs.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_jobs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_users.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
    'news.index': { paramsTuple?: []; params?: {} }
    'news.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'scheduled_events.index': { paramsTuple?: []; params?: {} }
    'find.events': { paramsTuple?: []; params?: {} }
    'event': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'find.parishes': { paramsTuple?: []; params?: {} }
    'about-us': { paramsTuple?: []; params?: {} }
    'archbishop.index': { paramsTuple?: []; params?: {} }
    'departments.index': { paramsTuple?: []; params?: {} }
    'departments.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'services.index': { paramsTuple?: []; params?: {} }
    'services.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'donate.index': { paramsTuple?: []; params?: {} }
    'registerParishioner.index': { paramsTuple?: []; params?: {} }
    'privacy': { paramsTuple?: []; params?: {} }
    'charities.index': { paramsTuple?: []; params?: {} }
    'vocations': { paramsTuple?: []; params?: {} }
    'jobs.index': { paramsTuple?: []; params?: {} }
    'jobs.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'jobs.application': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'dailyReadings': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'payment.callback': { paramsTuple: [ParamValue]; params: {'token': ParamValue} }
    'signIn': { paramsTuple?: []; params?: {} }
    'auth.handle_callback': { paramsTuple?: []; params?: {} }
    'listCharacters': { paramsTuple?: []; params?: {} }
    'discord.redirect': { paramsTuple?: []; params?: {} }
    'auth.handle_discord_callback': { paramsTuple?: []; params?: {} }
    'profile': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_posts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_events.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_events.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_jobs.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_jobs.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.index': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_users.create': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'home': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
    'news.index': { paramsTuple?: []; params?: {} }
    'news.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'scheduled_events.index': { paramsTuple?: []; params?: {} }
    'find.events': { paramsTuple?: []; params?: {} }
    'event': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'find.parishes': { paramsTuple?: []; params?: {} }
    'about-us': { paramsTuple?: []; params?: {} }
    'archbishop.index': { paramsTuple?: []; params?: {} }
    'departments.index': { paramsTuple?: []; params?: {} }
    'departments.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'services.index': { paramsTuple?: []; params?: {} }
    'services.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'donate.index': { paramsTuple?: []; params?: {} }
    'registerParishioner.index': { paramsTuple?: []; params?: {} }
    'privacy': { paramsTuple?: []; params?: {} }
    'charities.index': { paramsTuple?: []; params?: {} }
    'vocations': { paramsTuple?: []; params?: {} }
    'jobs.index': { paramsTuple?: []; params?: {} }
    'jobs.single': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'jobs.application': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'dailyReadings': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'deleteUser': { paramsTuple?: []; params?: {} }
    'discord.unlink': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'logout': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.store': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_events.store': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_jobs.store': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_users.store': { paramsTuple?: []; params?: {} }
    'contact.submit': { paramsTuple?: []; params?: {} }
    'donate.submit': { paramsTuple?: []; params?: {} }
    'registerParishioner.submit': { paramsTuple?: []; params?: {} }
    'jobs.application_submit': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
  }
  PATCH: {
    'switchCharacter': { paramsTuple?: []; params?: {} }
    'dashboard.dashboard_posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'dashboard.dashboard_posts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_jobs.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'dashboard.dashboard_users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}