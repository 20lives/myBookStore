import genres from './genres.ts';

import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  author: z.string().min(1),
  publicationDate: z.coerce.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }),
  genre: z.enum(genres),
});
