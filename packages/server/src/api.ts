import { Hono } from 'hono';
import { cors } from 'hono/cors';

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { eq } from "drizzle-orm";
import { connect } from '@planetscale/database';

import { zValidator } from "@hono/zod-validator";

import { bookSchema } from 'common/validationSchema';

const connection = connect({
  url: process.env.DATABASE_URL as string,
})

import * as schema from '../db/schema';
const db = drizzle(connection, { schema });

const api = new Hono();
api.use('/books/*', cors())

api.get('/', (c) => {
  return c.json({ message: 'Hello' })
})

api.get('/books', async (c) => {
  const books = await db.query.books.findMany({});
  return c.json({ books: books });
})

api.post('/books', zValidator('json', bookSchema), async (c) => {
  const params = await c.req.valid('json');
  console.log(params);
  try {
    const book = await db.insert(schema.books).values(params);
    return c.json({ book }, 201);
  } catch {
    return c.json({ description: "Can't add a new book!", error: true }, 422);
  }
});

api.get('/books/:id', async (c) => {
  const id = c.req.param('id');
  const book = await db.query.books.findFirst({ 
    where: (books, { eq }) => (eq(books.id, id)),
  });
  if (!book) {
    return c.json({ error: 'Not Found' }, 404);
  }
  return c.json({ book });
});

api.delete('/books/:id', async (c) => {
  const id = Number(c.req.param('id'));
  console.log('id:', id);
  try {
    const response = await db.delete(schema.books).where(eq(schema.books.id, id));
    return c.json({ success: response.rowsAffected > 0 });
  } catch (e) {
    console.log(e);
    return c.json({ description: "arr, can't delete that book!", error: true }, 422);
  }
});

export default api;
