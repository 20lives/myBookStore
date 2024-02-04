'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';

import genres from 'common/genres';

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { toast } from "sonner";

export default function Home() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');

  const [genre, setGenre] = useState('');
  const [publicationDate, setPublicationDate] = useState(new Date());

  const textFields = {
    Title: setTitle,
    Description: setDescription,
    Author: setAuthor,
  };

  const deleteBook = async (id) => {
    const res = await fetch(`http://localhost:3000/api/books/${id}`, { method: 'DELETE'}).then((res) => res.json())
    toast(res.success ? `Book #${id} was deleted!` : `Could not delete book #${id}`);
    fetchBooks();
  }

  const submit = async () => {
    const res = await fetch('http://localhost:3000/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, author, description, genre, publicationDate }),
    }).then((resp) => resp.json());

    console.log(res.success);
    if (res.success !== false) {
      toast('Book added succesfuly!');
      fetchBooks();
      setDialogOpen(false);
    } else {
      toast(JSON.stringify(res));
    }
  }

  const fetchBooks = () => {
    fetch('http://localhost:3000/api/books')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add new Book</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add new Book</DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
            {['Title', 'Description', 'Author'].map(field => (
              <div key={field} className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor={field.toLowerCase()} className="sr-only">{field}</Label>
                  <Input id={field.toLowerCase()} placeholder={field} onChange={({ target }) => textFields[field](target.value)} />
                </div>
              </div>
            ))}
            <Label>Genre:</Label>
            <RadioGroup onValueChange={(value) => setGenre(value)}>
              {genres.map(genre => (
              <div key={genre} className="flex items-center space-x-2">
                <RadioGroupItem value={genre} id={genre} />
                <Label htmlFor={genre}>{genre}</Label>
              </div>
              ))}
            </RadioGroup>
            <Calendar
              mode="single"
              selected={publicationDate}
              onSelect={setPublicationDate}
              initialFocus
            />
            <DialogFooter className="sm:justify-start">
              <Button type="submit" size="sm" className="px-3" onClick={submit} >
                Submit
                <span className="sr-only">Submit</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      <div className="mt-5 z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <div className="grid grid-cols-3 gap-5">
          {data.books.map(book => {
            return <Card key={book.id}>
              <CardHeader>
                <CardTitle className="h-16">{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="w-full flex justify-center">
                <p className="h-48 w-48 bg-gray-200 flex justify-center items-center">Book Cover</p>
              </CardContent>
              <CardFooter>
                {book.genre}
              </CardFooter>
              <div className="text-right">
                <button onClick={() => deleteBook(book.id)} className="px-4 text-right">
                    <span className="sr-only">Delete</span>
                    <Trash className="h-4 w-4" />
                </button>
              </div>
            </Card>
            })}
        </div>
      </div>
      <Toaster />
    </main>);
}
