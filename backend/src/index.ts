import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.get('/', (c) => {
  return c.json({
    service: 'AdvisingLog API',
    status: 'online',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    environment: 'Cloudflare Workers',
    database: c.env?.DB ? 'D1 Bound' : 'D1 Pending Binding',
  })
})

app.get('/api/info', (c) => {
  return c.json({
    app: 'AdvisingLog',
    roles: ['student', 'advisor', 'qa_chair', 'admin'],
    techStack: {
      framework: 'Hono',
      platform: 'Cloudflare Workers',
      database: 'Cloudflare D1',
      orm: 'Drizzle ORM',
    },
  })
})

export default app
