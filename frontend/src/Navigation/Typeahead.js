import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Typeahead = ({ handleSelect }) => {
  //Declaring state variables
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  //fetching book suggestions based on the input value
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value?.length >= 2) {
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${value}&key=AIzaSyCz_mk4HXPvrXxTkwdlQtOi0qpfVgw0O3I`
          );
          const data = await response.json();
          setSuggestions(data.items);
        } catch (error) {
          console.error(error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [value]);

  const matchedSuggestions = [];

  //checking if suggestions array has items
  if (suggestions && suggestions.length > 0) {
    //loop to iterate through each item in the suggestions array
    for (let i = 0; i < suggestions.length; i++) {
      //loop also iterates through each item in the suggestions array
      for (let i = 0; i < suggestions.length; i++) {
        //getting the current suggestion object from the suggestions array
        const suggestion = suggestions[i];
        //extracting the book title from the suggestion object
        const title = suggestion.volumeInfo.title;
        let isDuplicate = false;
        //iterating through the matchedSuggestions array
        for (let j = 0; j < matchedSuggestions.length; j++) {
          //getting the title of the j-th matched suggestion
          const matchedTitle = matchedSuggestions[j].title;
          //if the current suggestion's title matches the matchedTitle, set the isDuplicate flag to true
          if (matchedTitle === title) {
            isDuplicate = true;
            break;
          }
        }

        //if the current suggestion is not a duplicate, create a new matchedSuggestion object
        if (!isDuplicate) {
          const matchedSuggestion = {
            ...suggestion, //copying all properties of the suggestion object
            title: title, //adding the title property
            authors: suggestion.volumeInfo.authors
              ? suggestion.volumeInfo.authors.join(", ")
              : "",
            genres: suggestion.volumeInfo.categories
              ? suggestion.volumeInfo.categories.join(", ")
              : "",
          };
          //pushing the new matchedSuggestion object to the matchedSuggestions array
          matchedSuggestions.push(matchedSuggestion);
        }
      }
    }
  }

  return (
    <Wrapper>
      <Input
        type="text"
        value={value}
        onChange={(ev) => {
          setValue(ev.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter") {
            handleSelect(ev.target.value);
          }
        }}
      />
      {value.length >= 2 && showSuggestions && (
        <Results>
          {matchedSuggestions.length > 0 ? (
            <ul>
              {matchedSuggestions.map((suggestion) => {
                const searchTermIndex = suggestion.title
                  .toLowerCase()
                  .indexOf(value.toLowerCase());
                const firstHalf = suggestion.title.slice(
                  0,
                  searchTermIndex + value.length
                );
                const secondHalf = suggestion.title.slice(
                  searchTermIndex + value.length
                );

                return (
                  <Suggestion
                    key={suggestion.id}
                    onClick={() => {
                      handleSelect(suggestion.title);
                      navigate(`/book/${suggestion.id}`);
                      setShowSuggestions(false);
                    }}
                  >
                    <span>
                      {firstHalf}
                      <Prediction>{secondHalf}</Prediction>
                    </span>
                  </Suggestion>
                );
              })}
            </ul>
          ) : (
            <NoResults>No results found.</NoResults>
          )}
        </Results>
      )}
    </Wrapper>
  );
};

export default Typeahead;

const Input = styled.input`
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 5px;
  border: none;
  width: 400px;
  margin-right: 10px;
`;

const Button = styled.button`
  font-family: "Roboto", sans-serif;
  font-size: 1.2rem;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  background-color: #7ba05b;
  color: white;

  &:hover {
    background-color: #411a03;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Results = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  right: 0;
`;

const Suggestion = styled.li`
  font-family: "Roboto", sans-serif;
  list-style-type: none;
  padding: 10px;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: #f5deb3;
  }
`;

const NoResults = styled.div`
  font-family: "Roboto", sans-serif;
  padding: 10px;
  background-color: white;
`;

const Prediction = styled.span`
  font-family: "Roboto", sans-serif;
  font-weight: bold;
`;
