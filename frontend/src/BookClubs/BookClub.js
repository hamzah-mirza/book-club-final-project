import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../Navigation/Header";

//setting the API base URL
const API_BASE_URL = "http://localhost:8888";

const BookClub = () => {
  //state variables for book club data, loading status, error status, and form input fields
  const [bookClub, setBookClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pageToRead, setPageToRead] = useState("");
  const navigate = useNavigate();

  //extracting book ID from URL parameters
  const { bookId } = useParams();

  //fetching book club data using useEffect and storing it in the state
  useEffect(() => {
    const fetchBookClub = async () => {
      setLoading(true);
      console.log("Book Id: " + bookId);
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookclubs/${bookId}`);
        console.log("Response status:", response.status);
        if (response.status === 404) {
          setBookClub(null);
        } else if (!response.ok) {
          console.log("Error fetching book club data");
        } else {
          const data = await response.json();
          setBookClub(data);
        }
      } catch (error) {
        console.log(error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookClub();
  }, [bookClub]);

  //creating a new book club using form data and sending a POST request to the API
  const createBookClub = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookclubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: bookId,
          name,
          description,
          pageToRead,
        }),
      });
      const data = await response.json();
      console.log(data);
      setBookClub(data);

      //Redirecting to the NewBookClub component
      navigate(`/bookClubs/mongo/${data._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  //displaying error message, loading message, book club data or form based on the state
  if (error) {
    return <Container>Error loading book club data.</Container>;
  }

  if (loading) {
    return <Container>Loading book club data...</Container>;
  }

  if (bookClub) {
    return (
      <Container>
        <Title>{bookClub.name}</Title>
        <p>{bookClub.description}</p>
        <p>Read until page {bookClub.pageToRead}</p>
      </Container>
    );
  }

  //returning form to create a new book club
  return (
    <Container>
      <Header />
      <Title>Create a Book Club</Title>
      <Form onSubmit={createBookClub}>
        <Label>
          Name:
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Label>
        <Label>
          Description:
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Label>
        <Label>
          Read until page:
          <Input
            type="number"
            value={pageToRead}
            onChange={(e) => setPageToRead(e.target.value)}
            required
          />
        </Label>
        <Button type="submit">Create Book Club</Button>
      </Form>
    </Container>
  );
};

export default BookClub;

const Container = styled.div`
  max-width: 800px;
  margin: 90px auto 50px auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  font-size: 16px;
  padding: 5px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  font-size: 16px;
  padding: 5px;
  resize: none;
  height: 100px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  font-size: 16px;
  padding: 10px 20px;
  background: linear-gradient(to right, #7ba05b, #411a03);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: linear-gradient(to right, #7ba05b, #411a03);
  }
`;
