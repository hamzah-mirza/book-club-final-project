import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

//Book component to display book details
const Book = ({ data }) => {
  //destructuring required properties from the volumeInfo object
  const { title, authors, description, categories, imageLinks } =
    data.volumeInfo;

  //setting the thumbnail image or an empty string if not available
  const thumbnail = imageLinks?.thumbnail || "";
  const navigate = useNavigate();

  //function to handle the click event on a book
  const handleClick = () => {
    navigate(`/book/${data.id}`);
  };

  //rendering the Book component
  return (
    <BookContainer onClick={handleClick}>
      <BookImage src={thumbnail} alt={`${title}`} />
      <BookInfo>
        <BookTitle>{title}</BookTitle>
        <BookAuthor>{authors && authors.join(", ")}</BookAuthor>
        <BookSynopsis>{description}</BookSynopsis>
        <BookGenre>
          {(categories && categories.join(", ")) || "Unknown"}
        </BookGenre>
      </BookInfo>
    </BookContainer>
  );
};

export default Book;

const BookContainer = styled.div`
  display: flex;
  border: 1px solid #ccc;
  padding: 16px;
  cursor: pointer;
  margin-right: 15px;
`;

const BookImage = styled.img`
  width: 128px;
  height: 192px;
  object-fit: cover;
  margin-right: 16px;
`;

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const BookTitle = styled.h2`
  margin: 0;
  font-size: 1.5em;
`;

const BookAuthor = styled.h3`
  margin: 0;
  font-size: 1.2em;
  color: #666;
`;

const BookSynopsis = styled.p`
  font-size: 1em;
  margin: 8px 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
  margin-left: 0;
`;

const BookGenre = styled.p`
  margin: 0;
  font-size: 0.9em;
  color: #999;
`;
