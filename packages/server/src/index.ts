import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import api from './api';

const app = new Hono();
app.get('/', (c) => c.text('My Bookstore API'));
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

const middleware = new Hono();

middleware.use('*', prettyJSON());

app.route('/api', middleware);
app.route('/api', api);

export default app;
