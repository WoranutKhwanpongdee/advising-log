import { describe, it, expect } from 'vitest'
import app from './index'

describe('Backend Hono API', () => {
  it('GET / returns system status JSON', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    const body = await res.json() as { service: string; status: string }
    expect(body.service).toBe('AdvisingLog API')
    expect(body.status).toBe('online')
  })

  it('GET /api/health returns healthy status', async () => {
    const res = await app.request('/api/health')
    expect(res.status).toBe(200)
    const body = await res.json() as { status: string; environment: string }
    expect(body.status).toBe('healthy')
  })

  it('GET /api/info returns tech stack details', async () => {
    const res = await app.request('/api/info')
    expect(res.status).toBe(200)
    const body = await res.json() as { app: string; roles: string[] }
    expect(body.app).toBe('AdvisingLog')
    expect(body.roles).toContain('student')
    expect(body.roles).toContain('advisor')
  })
})
