import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Header from "../Navigation/Header";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

//Base URL for API calls
const API_BASE_URL = "http://localhost:8888";

const Profile = () => {
  const { isAuthenticated, user } = useAuth0();
  const [bookClubs, setBookClubs] = useState([]);
  const navigate = useNavigate();

  //function to fetch book clubs from the API
  const fetchBookClubs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bookclubs`);
      if (!response.ok) {
        console.log("Error fetching book clubs");
        return;
      }
      const data = await response.json();
      setBookClubs(data);
      console.log(`Total number of book clubs: ${data.length}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = async (bookClubId, event) => {
    event.stopPropagation(); //preventing triggering GridItem's onClick event
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/bookclubs/${bookClubId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting book club");
      } else {
        //removing the deleted book club from the state
        setBookClubs(
          bookClubs.filter((bookClub) => bookClub._id !== bookClubId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  //useEffect to fetch book clubs on component mount
  useEffect(() => {
    fetchBookClubs();
  }, []);

  //function to handle book club item click
  const handleBookClubClick = (bookClubId) => {
    navigate(`/bookclubs/mongo/${bookClubId}`);
  };

  //rendering the Profile component
  return (
    isAuthenticated && (
      <>
        <Header />
        <Article>
          <ProfileInfo>
            <ProfileImage src={user.picture} alt={user.name} />
            <ProfileName>{user.name}</ProfileName>
          </ProfileInfo>
          <Grid>
            {bookClubs.map((bookClub) => (
              <GridItem
                key={bookClub._id}
                onClick={() => handleBookClubClick(bookClub._id)}
              >
                <DeleteButton
                  onClick={(event) => handleDeleteClick(bookClub._id, event)}
                >
                  X
                </DeleteButton>
                <Gradient />
                {bookClub.name}
              </GridItem>
            ))}
          </Grid>
        </Article>
      </>
    )
  );
};

export default Profile;

const Article = styled.div`
  margin-top: 90px;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ProfileName = styled.span`
  font-weight: bold;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 20px;
`;

const GridItem = styled.div`
  color: #f5deb3;
  position: relative;
  padding: 20px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

const Gradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(to right, #7ba05b, #411a03);
  border-radius: 5px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #e74c3c;
  color: white;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1;

  &:hover {
    background-color: #c0392b;
  }
`;
