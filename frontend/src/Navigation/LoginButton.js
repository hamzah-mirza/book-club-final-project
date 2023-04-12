import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const LoginButton = () => {
  //destructure necessary functions and properties from the useAuth0 hook
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  //rendering the LoginButton if the user is not authenticated
  return (
    !isAuthenticated && (
      <LoginButtonStyled onClick={() => loginWithRedirect()}>
        Sign In
      </LoginButtonStyled>
    )
  );
};

export default LoginButton;

const LoginButtonStyled = styled.button`
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
