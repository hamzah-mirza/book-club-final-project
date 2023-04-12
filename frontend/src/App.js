import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Home/HomePage";
import BookDetails from "./BookClubs/BookDetails";
import BookClub from "./BookClubs/BookClub";
import UpcomingBooksPage from "./BookClubs/UpcomingBooksPage";
import Profile from "./Profile/Profile";
import { createGlobalStyle } from "styled-components";
import NewBookClub from "./BookClubs/NewBookClub";

//Defining global styles for the entire app
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f5f5dc;
    font-family: Arial, sans-serif;
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bookClubs/:bookId" element={<BookClub />} />
          <Route path="/book/:bookId" element={<BookDetails />} />
          <Route path="/upcoming-books" element={<UpcomingBooksPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bookClubs/mongo/:mongoId" element={<NewBookClub />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
