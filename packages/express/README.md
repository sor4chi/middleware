# Express Hono Middleware

This middleware mounts Hono applications as subroutes in Express inspired by [@fastify/express](https://www.npmjs.com/package/@fastify/express).

## Usage

```typescript
const app = express()
app.use('/hono', hono(new Hono().get('/', (c) => c.text('Hello Hono in Express!'))))

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
```

You can get "Hello Hono in Express!" by accessing `http://localhost:3000/hono`.

## Author

Sor4chi <https://github.com/sor4chi>

## License

MIT
