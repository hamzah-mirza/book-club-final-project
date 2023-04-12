import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Authentication from "./Authentication";
import Typeahead from "./Typeahead";

const Header = () => {
  //State for storing upcoming books list
  const [upcomingBooks, setUpcomingBooks] = useState([]);
  const navigate = useNavigate();

  //function to handle Home button click and navigate to the homepage
  const handleHomeClick = () => {
    navigate("/");
  };

  //function to fetch upcoming books and navigate to the upcoming books page
  const fetchUpcomingBooks = async () => {
    //defining parameters for fetching books
    const query = "subject:fiction";
    const orderBy = "newest";
    const maxResults = 40;
    const apiKey = "AIzaSyCz_mk4HXPvrXxTkwdlQtOi0qpfVgw0O3I";

    const fetchBooks = async (startIndex) => {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&orderBy=${orderBy}&maxResults=${maxResults}&startIndex=${startIndex}&key=${apiKey}`
      );
      return await response.json();
    };

    let startIndex = 0;
    let unreleasedBooks = [];

    //fetching books until we find unreleased books
    while (unreleasedBooks.length === 0) {
      const data = await fetchBooks(startIndex);
      console.log(data);
      if (data.items) {
        unreleasedBooks = data.items.filter((book) => {
          if (!book.volumeInfo.publishedDate) {
            return false;
          }
          const publicationDate = new Date(book.volumeInfo.publishedDate);
          return publicationDate > new Date();
        });
      } else {
        console.error("No items found in the response:", data);
        break;
      }
      startIndex += maxResults;
    }

    //updating upcoming books state and navigate to the upcoming books page
    setUpcomingBooks(unreleasedBooks);
    navigate("/upcoming-books", { state: { upcomingBooks: unreleasedBooks } });
  };

  //function to handle My Profile button click and navigate to the profile page
  const handleMyProfileClick = () => {
    navigate("/profile");
  };

  return (
    <HeaderContainer>
      <Typeahead handleSelect={(selectedTitle) => {}} />
      <HeaderTitle onClick={handleHomeClick}>Home</HeaderTitle>
      <HeaderTitle onClick={fetchUpcomingBooks}>Upcoming Books</HeaderTitle>
      <ButtonContainer>
        <MyProfileButton onClick={handleMyProfileClick}>
          My Profile
        </MyProfileButton>
        <ul>
          {upcomingBooks.map((book) => (
            <li key={book.id}>{book.volumeInfo.title}</li>
          ))}
        </ul>
        <Authentication />
      </ButtonContainer>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: linear-gradient(to right, #7ba05b, #411a03);
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Roboto", sans-serif;
`;

const HeaderTitle = styled.p`
  text-align: center;
  cursor: pointer;
  font-size: 20px;
  color: #f5deb3;
  margin: 0;
  &:hover {
    color: #cce6ff;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MyProfileButton = styled.button`
  background: linear-gradient(to right, #7ba05b, #411a03);
  border: none;
  outline: 0;
  position: absolute;
  top: 10;
  right: 150px;
  cursor: pointer;
  font-size: 1rem;
  color: white;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  &:hover {
    background: linear-gradient(to right, #7ba05b, #411a03);
  }
`;
