import env from '#start/env'

type FactionConfig = {
  factionId: number
  lowestLeadershipRank: number
  lowestSupervisorRank: number
  minimalRankDashboardAccess: number
}

const factionConfig: FactionConfig = {
  factionId: env.get('GTAW_FACTION_ID', 563),
  lowestLeadershipRank: env.get('LOWEST_FACTION_LEADERSHIP_RANK', 14),
  lowestSupervisorRank: env.get('LOWEST_FACTION_SUPERVISOR_RANK', 10),
  minimalRankDashboardAccess: env.get('MINIMAL_FACTION_RANK_DASHBOARD_ACCESS', 9),
}

export default factionConfig
