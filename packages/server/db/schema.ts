import { int, mysqlEnum, mysqlTable, uniqueIndex, varchar, serial, date } from 'drizzle-orm/mysql-core';
import genres from 'common/genres';

export const books = mysqlTable('books', {
  id: serial("id").primaryKey(),
  title: varchar('title', { length: 256 }),
  description: varchar('description', { length: 8192} ),
  author: varchar('author', { length: 256 }),
  publicationDate: date('publication_date'),
  genre: mysqlEnum('genre', genres),
});

