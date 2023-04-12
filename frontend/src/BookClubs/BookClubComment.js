//SCAPPED STRETCH GOAL
import { useState, useEffect } from "react";
import styled from "styled-components";

const BookClubComment = () => {
  const [count, setCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(false);
  const [comments, setComments] = useState([]);

  const fetchComments = () => {
    fetch("/api/comments")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          res.text().then((text) => {
            console.error("Error response text:", text);
            throw new Error("Failed to fetch comments");
          });
        }
      })
      .then((data) => setComments(data || []))
      .catch((error) => {
        console.error("Error fetching comments:", error.message);
        setError(true);
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = { text: commentText };

    if (commentText.trim() === "") {
      return;
    }

    fetch("http://localhost:8888/api/comments", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        setCommentText("");
        setCount(0);
        fetchComments();
      })
      .catch((error) => setError(true));
  };

  if (error) {
    return <div>Error occurred</div>;
  }

  const handleChange = (event) => {
    const input = event.target.value;
    setCommentText(input);
    setCount(input.length);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Textarea
          onChange={handleChange}
          placeholder="Write your comment..."
          value={commentText}
        />
        <Remaining>{count}/280</Remaining>
        <PostButton type="submit">Post</PostButton>
      </Form>
      <CommentsList>
        {comments.length === 0 ? (
          <NoComments>No comments found. Be the first to comment!</NoComments>
        ) : (
          comments.map((comment) => (
            <Comment key={comment._id}>{comment.text}</Comment>
          ))
        )}
      </CommentsList>
    </div>
  );
};

export default BookClubComment;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 150px;
  resize: none;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
`;

const PostButton = styled.button`
  background-color: #007bff;
  color: white;
  font-size: 16px;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #7fb8ff;
    cursor: not-allowed;
  }
`;
const Remaining = styled.div`
  margin-bottom: 10px;
`;

const CommentsList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
  margin: 30px auto;
`;

const Comment = styled.li`
  background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 3px;
`;

const NoComments = styled.div`
  font-size: 18px;
  text-align: center;
  margin-bottom: 15px;
`;
