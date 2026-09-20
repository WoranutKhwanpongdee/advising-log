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

  it('GET /api/info returns tech stack details and all roles', async () => {
    const res = await app.request('/api/info')
    expect(res.status).toBe(200)
    const body = await res.json() as { app: string; roles: string[] }
    expect(body.app).toBe('AdvisingLog')
    expect(body.roles).toEqual(['student', 'advisor', 'qa_chair', 'admin'])
  })

  it('POST /api/auth/google decodes JWT credential and authenticates student user', async () => {
    // Construct valid sample base64 JWT payload
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
    const payload = btoa(JSON.stringify({
      email: '6631503001@student.mfu.ac.th',
      name: 'Somchai Jaidee',
      sub: 'google_123456789',
      picture: 'https://lh3.googleusercontent.com/a/sample',
    }))
    const dummyJwt = `${header}.${payload}.signature`

    const res = await app.request('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: dummyJwt }),
    })

    expect(res.status).toBe(200)
    const data = await res.json() as any
    expect(data.success).toBe(true)
    expect(data.user.email).toBe('6631503001@student.mfu.ac.th')
    expect(data.user.role).toBe('student')
  })

  it('POST /api/qa/ai-analyze generates qualitative retention analysis', async () => {
    const payload = {
      mode: 'strategic_synthesis',
      cases: [
        {
          id: 'EXT001',
          studentCode: '6631503006',
          academicYear: '2026',
          exitType: 'leave_of_absence',
          reasonCode: 'family_obligation',
          details: 'Family emergency care',
          advisorAssessment: 'Recommend 1 semester leave',
        },
      ],
      language: 'th',
    }

    const res = await app.request('/api/qa/ai-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    expect(res.status).toBe(200)
    const data = await res.json() as any
    expect(data.success).toBe(true)
    expect(data.analysis).toContain('AUN-QA')
  })

  it('GET /api/users returns safe empty array when DB binding is detached in unit test', async () => {
    const res = await app.request('/api/users')
    expect(res.status).toBe(200)
    const data = await res.json() as { users: any[] }
    expect(Array.isArray(data.users)).toBe(true)
  })

  it('GET /api/requests returns safe empty array when DB binding is detached in unit test', async () => {
    const res = await app.request('/api/requests')
    expect(res.status).toBe(200)
    const data = await res.json() as { requests: any[] }
    expect(Array.isArray(data.requests)).toBe(true)
  })

  it('GET /api/follow-ups returns safe empty array when DB binding is detached in unit test', async () => {
    const res = await app.request('/api/follow-ups')
    expect(res.status).toBe(200)
    const data = await res.json() as { followUps: any[] }
    expect(Array.isArray(data.followUps)).toBe(true)
  })
})
