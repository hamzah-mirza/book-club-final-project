import React from "react";
import { useLocation } from "react-router-dom";
import Book from "../BookClubs/Book";
import Header from "../Navigation/Header";
import styled from "styled-components";

const UpcomingBooksPage = () => {
  //accesing location object from react-router
  const location = useLocation();

  //retrieving upcomingBooks from location.state or default to an empty array
  const upcomingBooks = location.state?.upcomingBooks || [];

  //rendering the component
  return (
    <>
      <Header />
      <UpcomingBooksContainer>
        <h1>Upcoming Books</h1>
        <BookList>
          {upcomingBooks.map((book) => (
            <Book key={book.id} data={book} />
          ))}
        </BookList>
      </UpcomingBooksContainer>
    </>
  );
};

export default UpcomingBooksPage;

const UpcomingBooksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
`;

const BookList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  margin-top: 20px;
`;
