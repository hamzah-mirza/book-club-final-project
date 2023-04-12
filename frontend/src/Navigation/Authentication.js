import React from "react";
import styled from "styled-components";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const Authentication = () => {
  //destructuring isLoading and error properties from the Auth0 hook
  const { isLoading, error } = useAuth0();

  //rendering authentication status and login/logout buttons
  return (
    <AuthenticationWrapper>
      {/* Displaying an error message if there is an authentication error */}
      {error && <p> Authentication Error</p>}
      {/* Displaying a loading message while authentication is in progress */}
      {!error && isLoading && <p>Loading...</p>}
      {/* Displaying Login and Logout buttons when authentication is not loading and there is no error */}
      {!error && !isLoading && (
        <>
          <LoginButton />
          <LogoutButton />
        </>
      )}
    </AuthenticationWrapper>
  );
};

export default Authentication;

const AuthenticationWrapper = styled.div`
  margin-left: 300px;
`;
