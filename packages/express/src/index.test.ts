import { getCookie, setCookie } from 'hono/cookie'
import express from 'express'
import { Hono } from 'hono'
import request from 'supertest'
import { hono } from '.'
import { test, expect } from 'vitest'

test('mount hono app in express', async () => {
  const app = express()
  app.use('/hono', hono(new Hono().get('/', (c) => c.text('Hello World!'))))

  const res = await request(app).get('/hono')
  expect(res.status).toBe(200)
  expect(res.text).toBe('Hello World!')
})

test('mount hono app with a different route', async () => {
  const app = express()
  app.use('/api', hono(new Hono().get('/hello', (c) => c.text('Hello API!'))))

  const res = await request(app).get('/api/hello')
  expect(res.status).toBe(200)
  expect(res.text).toBe('Hello API!')
})

test('mount hono app with a POST route', async () => {
  const app = express()
  app.use('/api', hono(new Hono().post('/data', (c) => c.json({ message: 'Data received' }))))

  const res = await request(app).post('/api/data')
  expect(res.status).toBe(200)
  expect(res.body).toEqual({ message: 'Data received' })
})

test('mount hono app with a 404 route', async () => {
  const app = express()
  app.use('/api', hono(new Hono().get('/not-found', (c) => c.text('Not Found'))))

  const res = await request(app).get('/api/unknown')
  expect(res.status).toBe(404)
})

test('mount hono app with a 500 route', async () => {
  const app = express()
  app.use(
    '/api',
    hono(
      new Hono().get('/error', () => {
        throw new Error('Internal Server Error')
      })
    )
  )

  const res = await request(app).get('/api/error')
  expect(res.status).toBe(500)
  expect(res.text).toBe('Internal Server Error')
})

test('mount hono app with custom headers', async () => {
  const app = express()
  app.use(
    '/api',
    hono(
      new Hono().get('/custom-headers', (c) => {
        c.header('x-custom-header', 'value')
        return c.text('Custom headers set')
      })
    )
  )

  const res = await request(app).get('/api/custom-headers')
  expect(res.status).toBe(200)
  expect(res.text).toBe('Custom headers set')
  expect(res.headers['x-custom-header']).toBe('value')
})

test('mount hono app with setCookie, getCookie', async () => {
  const app = express()
  app.use(
    '/api',
    hono(
      new Hono()
        .get('/set-cookie', (c) => {
          setCookie(c, 'name', 'value')
          return c.text('Cookie set')
        })
        .get('/get-cookie', (c) => {
          return c.text(getCookie(c, 'name') || 'No cookie')
        })
    )
  )

  const setRes = await request(app).get('/api/set-cookie')
  expect(setRes.status).toBe(200)
  expect(setRes.text).toBe('Cookie set')

  const getRes = await request(app).get('/api/get-cookie').set('Cookie', 'name=value')
  expect(getRes.status).toBe(200)
  expect(getRes.text).toBe('value')
})
