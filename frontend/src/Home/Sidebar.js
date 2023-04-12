import React, { useState } from "react";
import styled from "styled-components";

const Sidebar = ({ setBooks }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const popularAuthors = [
    "J.K. Rowling",
    "Stephen King",
    "Dan Brown",
    "J.R.R. Tolkien",
    "Agatha Christie",
    "George R.R. Martin",
    "John Grisham",
    "Michael Crichton",
    "Neil Gaiman",
    "Terry Pratchett",
    "Haruki Murakami",
    "Margaret Atwood",
    "Gabriel Garcia Marquez",
    "Philip Pullman",
    "Ernest Hemingway",
    "Jane Austen",
    "Mark Twain",
    "William Shakespeare",
    "Charles Dickens",
    "Edgar Allan Poe",
  ];

  const genres = [
    "fiction",
    "mystery",
    "thriller",
    "fantasy",
    "romance",
    "biography",
    "history",
    "science",
  ];

  //function to fetch books based on the selected option (author/genre)
  const fetchBooks = async (option) => {
    const apiKey = "AIzaSyCz_mk4HXPvrXxTkwdlQtOi0qpfVgw0O3I";
    const maxResults = 40;

    //determining if the selected option is a genre or an author
    let isGenre = genres.includes(option);
    const searchQuery = isGenre ? `subject:${option}` : `inauthor:${option}`;

    try {
      //fetching books from Google Books API
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=${maxResults}&key=${apiKey}`
      );
      const data = await response.json();

      //if books are found, this is the result
      if (!data || !data.items || data.items.length === 0) {
        console.warn("No books found for option", option);
        return;
      }

      //adding unknown category if none exists
      const booksWithGenres = data.items.map((book) => {
        return {
          ...book,
          volumeInfo: {
            ...book.volumeInfo,
            categories: book.volumeInfo.categories
              ? book.volumeInfo.categories
              : ["Unknown"],
          },
        };
      });

      //updating the books state
      setBooks(booksWithGenres);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  //function to handle changes in the dropdown selection
  const handleOptionChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);
    fetchBooks(option);
  };

  //Returning the Sidebar component
  return (
    <SidebarContainer>
      <Dropdown onChange={handleOptionChange} value={selectedOption}>
        <option value="" disabled hidden>
          Select an author/genre
        </option>
        <optgroup label="Authors">
          {popularAuthors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </optgroup>
        <optgroup label="Genres">
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </optgroup>
      </Dropdown>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  height: 100%;
  width: 100px;
  padding: 16px;
  background-image: linear-gradient(
    90deg,
    #5c5b5a 0%,
    #5c5b5a 50%,
    #7a5c5b 100%
  );
`;

const Dropdown = styled.select`
  display: block;
  width: 100%;
  padding: 8px 16px;
  margin-bottom: 8px;
  background-image: linear-gradient(90deg, #7a5c5b 0%, #5c5b5a 100%);
  border: none;
  color: white;
  text-align: left;
  font-size: 1em;
  cursor: pointer;
  &:hover {
    background-image: linear-gradient(90deg, #5c5b5a 0%, #7a5c5b 100%);
  }
`;
