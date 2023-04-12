import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../Navigation/Header";

const API_BASE_URL = "http://localhost:8888";

const NewBookClub = () => {
  const [bookClub, setBookClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [description, setDescription] = useState("");
  const [formMessage, setFormMessage] = useState("");

  //extracting mongoId from URL parameters
  const { mongoId } = useParams();

  useEffect(() => {
    //fetching book club data from the API
    const fetchBookClub = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/bookclubs/${mongoId}`
        );
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
  }, [mongoId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookclubs/${mongoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Error updating book club description");
      } else {
        setFormMessage("Book club description updated successfully!");
        setBookClub({ ...bookClub, description });
      }
    } catch (error) {
      console.log(error);
      setFormMessage("Error updating book club description");
    }
  };

  //handling error and loading states
  if (error) {
    return <div>Error loading book club data.</div>;
  }

  if (loading) {
    return <div>Loading book club data...</div>;
  }

  //rendering the NewBookClub component
  if (bookClub) {
    return (
      <Wrapper>
        <Header />
        <Title>Welcome to the Book Club!</Title>
        <BookClubInfo>
          <h2>{bookClub.name}</h2>
          <p>{bookClub.description}</p>
          <p>For next week, read until page {bookClub.pageToRead}</p>
        </BookClubInfo>
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="description">Update book club description:</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Button type="submit">Update Description</Button>
        </Form>
        {formMessage && <FormMessage>{formMessage}</FormMessage>}
      </Wrapper>
    );
  }
};

export default NewBookClub;

const Wrapper = styled.div`
  margin-top: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const BookClubInfo = styled.div`
  background-color: #ecf0f1;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const Label = styled.label`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  padding: 1rem;
  font-size: 1.1rem;
  line-height: 1.6;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
  resize: none;
`;

const Button = styled.button`
  background-color: #7ba05b;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.8rem 2rem;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #6a874a;
  }
`;

const FormMessage = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;
