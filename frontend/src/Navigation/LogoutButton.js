import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const LogoutButton = () => {
  //destructure necessary functions and properties from the useAuth0 hook
  const { logout, isAuthenticated } = useAuth0();

  //rendering the LogoutButton if the user is authenticated
  return (
    isAuthenticated && (
      <LogoutButtonStyled onClick={() => logout()}>Sign Out</LogoutButtonStyled>
    )
  );
};

export default LogoutButton;

const LogoutButtonStyled = styled.button`
  background: linear-gradient(to right, #7ba05b, #411a03);
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 1rem;
  color: #ffffff;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  &:hover {
    background: linear-gradient(to right, #7ba05b, #411a03);
  }
`;
