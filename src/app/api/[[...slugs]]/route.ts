// app/[[...slugs]]/route.ts
import swagger from '@elysiajs/swagger';
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .group('/api', (app) =>
        app
        .use(swagger())
        .get('/api', (req) => {
            return { body: 'hello Next' }
        })
        .post('/api', ({ body }) => body, {
            body: t.Object({
                name: t.String()
            }),
            response: t.Object({
                name: t.String()
            })
        })
    )

export const GET = app.handle
export const POST = app.handle

export type App = typeof app