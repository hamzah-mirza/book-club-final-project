import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../Navigation/Header";

const BookDetails = () => {
  //state variables for book details, error status, and authentication
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [isSignedIn, setIsSignedIn] = useState(false);

  //handling button click event based on authentication status
  const handleButtonClick = () => {
    if (isSignedIn) {
      navigate(`/bookClubs/${bookId}`);
    } else {
      alert("Please sign in to continue.");
    }
  };

  //using Auth0 hook to get the authentication status
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    setIsSignedIn(isAuthenticated);
  }, [isAuthenticated]);

  //fetching book details using useEffect and storing it in the state
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${bookId}`
        );
        const data = await response.json();
        console.log(data);
        setBook(data);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  //displaying error message or loading message based on the state
  if (error) {
    return (
      <ErrorContainer>
        <h2>Error loading book details.</h2>
      </ErrorContainer>
    );
  }

  if (!book) {
    return (
      <LoadingContainer>
        <h2>Loading book details...</h2>
      </LoadingContainer>
    );
  }

  //extracting book information and rendering it
  const authors = book.volumeInfo.authors
    ? book.volumeInfo.authors.join(", ")
    : "";
  const categories = book.volumeInfo.categories
    ? book.volumeInfo.categories.join(", ")
    : "Unknown";

  const pageCount = book.volumeInfo.pageCount;
  const publishedDate = book.volumeInfo.publishedDate;
  const publisher = book.volumeInfo.publisher;
  let synopsis = book.volumeInfo.description
    ? book.volumeInfo.description.replace(/<\/?[^>]+(>|$)/g, "") //using regex to replace all the HTML tags
    : "There is no synopsis for this book";

  return (
    <>
      <Header />
      <BookContainer>
        <BookCoverWrapper>
          <BookCover
            src={book.volumeInfo.imageLinks?.thumbnail}
            alt={book.volumeInfo.title}
          />
        </BookCoverWrapper>
        <BookInfo>
          <h2>{book.volumeInfo.title}</h2>
          <InfoLine>
            <strong>Author: </strong>
            {authors}
          </InfoLine>
          <InfoLine>
            <strong>Genre: </strong>
            {categories}
          </InfoLine>
          <InfoLine>
            <strong>Publisher: </strong>
            {publisher}
          </InfoLine>
          <InfoLine>
            <strong>Published Date: </strong>
            {publishedDate}
          </InfoLine>
          <InfoLine>
            <strong>Page Count: </strong>
            {pageCount}
          </InfoLine>
          <InfoLine>
            <strong>Synopsis: </strong>
            {synopsis}
          </InfoLine>
          <StyledButton onClick={handleButtonClick}>
            Join Book Club
          </StyledButton>
        </BookInfo>
      </BookContainer>
    </>
  );
};

export default BookDetails;

const BookContainer = styled.div`
  display: flex;
  margin: 90px 50px 50px 50px;
`;

const BookCoverWrapper = styled.div`
  margin-right: 50px;
  margin-top: 20px;
`;

const BookCover = styled.img`
  object-fit: contain;
  width: 200px;
`;

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoLine = styled.p`
  margin-bottom: 10px;
  font-size: 16px;
  color: #555;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(to right, #7ba05b, #411a03);
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: linear-gradient(to right, #7ba05b, #411a03);
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
  font-size: 24px;
  color: #f00;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
  font-size: 24px;
  color: #555;
`;
