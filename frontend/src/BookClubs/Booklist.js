//used for the genres of the books
import React, { useState, useEffect } from "react";
import Book from "../BookClubs/Book";

const BookList = ({ selectedGenre }) => {
  //State variable for storing books fetched based on the selected genre
  const [books, setBooks] = useState(null);

  //fetching books based on the selected genre using useEffect
  useEffect(() => {
    if (selectedGenre) {
      const apiKey = "AIzaSyCz_mk4HXPvrXxTkwdlQtOi0qpfVgw0O3I";
      const maxResults = 100;
      const startIndex = 0;
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${selectedGenre}&maxResults=${maxResults}&startIndex=${startIndex}&key=${apiKey}`
      )
        .then((res) => res.json())
        .then((data) => {
          //filtering books with images and descriptions
          const booksWithImagesAndDescriptions = data.items.filter((book) => {
            return book.volumeInfo.imageLinks && book.volumeInfo.description;
          });
          //updating the books state with the filtered books
          setBooks(booksWithImagesAndDescriptions.slice(0, 100));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedGenre]);

  //rendering the fetched books using the Book component
  return (
    <div>
      {books &&
        books.map((book) => {
          return <Book key={book.id} data={book} />;
        })}
    </div>
  );
};

export default BookList;
