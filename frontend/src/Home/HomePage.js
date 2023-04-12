import React, { useState, useEffect } from "react";
import Book from "../BookClubs/Book";
import Sidebar from "./Sidebar";
import styled, { keyframes } from "styled-components";
import Header from "../Navigation/Header";
import { createGlobalStyle } from "styled-components";

const HomePage = () => {
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(false);

  //useEffect to fetch books from Google Books API when the application mounts
  useEffect(() => {
    const apiKey = "AIzaSyCz_mk4HXPvrXxTkwdlQtOi0qpfVgw0O3I";
    const query = "inauthor";
    const maxResults = 40;
    const startIndex = Math.floor(Math.random() * 1000);
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}&startIndex=${startIndex}&key=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const booksWithImagesAndDescriptions = data.items.filter((book) => {
          return book.volumeInfo.imageLinks && book.volumeInfo.description;
        });
        setBooks(booksWithImagesAndDescriptions.slice(0, 12));
      })
      .catch((error) => {
        setError(true);
      });
  }, []);

  // Rendering the HomePage component
  return (
    <>
      <GlobalStyles />
      <Header />
      <Sidebar setBooks={setBooks} />
      <Feed>
        {books !== null ? (
          books.map((book) => {
            return <Book key={book.id} data={book} />;
          })
        ) : (
          <div>Loading books...</div>
        )}
      </Feed>
    </>
  );
};

export default HomePage;

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #f5f5dc;
  }
`;

const Feed = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-left: 150px;
  margin-top: 10px;
  padding-top: 100px;
`;

const Rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Margin = styled.div`
  margin-left: 500px;
`;
