import { createServer } from 'node:http'

const routes: Record<string, unknown> = {
  '/api/user': {
    user: {
      character: [
        { id: 1, firstname: 'John', lastname: 'Doe', bank_routing_number: 1234 },
        { id: 2, firstname: 'Jane', lastname: 'Doe', bank_routing_number: 5678 },
      ],
    },
  },
  '/api/factions': {
    data: {
      '1': {
        faction: 563,
        faction_name: 'Archdiocese of Los Santos',
        faction_rank: 3,
        faction_rank_name: 'Priest',
      },
      '2': {
        faction: 563,
        faction_name: 'Archdiocese of Los Santos',
        faction_rank: 1,
        faction_rank_name: 'Low rank',
      },
    },
  },
}

createServer((req, res) => {
  const body = routes[req.url?.split('?')[0] ?? '']
  res.writeHead(body ? 200 : 404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body ?? { error: 'not found' }))
}).listen(3101)
