//CLEANUP REQUIRED
"use strict";
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const {
  addComment,
  getComments,
  addBookClub,
  getBookClubs,
  getBookClubById,
  deleteBookClubById,
  updateBookClubDescription,
} = require("./handlers");
const port = 8888;

const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

app.use(express.static("public"));

app.get("/test", (req, res) => {
  res.status(200).json({ itWorked: true });
});

app.post("/api/bookclubs", async (req, res) => {
  try {
    const bookClub = { ...req.body, _id: uuidv4() };
    const result = await addBookClub(bookClub);
    res.status(201).json({ _id: result });
  } catch (error) {
    console.log("Error in POST /api/bookclubs:", error);
  }
});

app.get("/api/bookclubs", async (req, res) => {
  try {
    const bookClubs = await getBookClubs();
    res.status(200).json(bookClubs);
  } catch (error) {
    console.log("Error in GET /api/bookclubs:", error);
  }
});

app.get("/api/bookclubs/:id", async (req, res) => {
  try {
    const bookClub = await getBookClubById(req.params.id);
    if (bookClub) {
      res.status(200).json(bookClub);
    } else {
      res.status(404).json({ message: "Book club not found" });
    }
  } catch (error) {
    console.log("Error in GET /api/bookclubs/:id:", error);
  }
});

app.get("/api/bookclubs/:id", async (req, res) => {
  try {
    const bookClub = await getBookClubById(req.params.id);
    res.status(200).json(bookClub);
  } catch (error) {
    console.log("Error in GET /api/bookclubs/:id:", error);
    if (error.message === "Book club not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

app.post("/api/comments", async (req, res) => {
  try {
    const comment = { ...req.body, _id: uuidv4() };
    const result = await addComment(comment);
    res.status(201).json({ _id: result });
  } catch (error) {
    console.log("Error in POST /api/comments:", error);
  }
});

app.get("/api/comments", async (req, res) => {
  try {
    const comments = await getComments();
    res.status(200).json(comments);
  } catch (error) {
    console.log("Error in GET /api/comments:", error);
  }
});

app.get("/api/users/:userId/bookclub", async (req, res) => {
  try {
    const { userId } = req.params;
    const bookClub = await getUserBookClub(userId);
    if (bookClub) {
      res.status(200).json(bookClub);
    } else {
      res.status(404).json({ message: "User not in any book club" });
    }
  } catch (error) {
    console.log("Error in GET /api/users/:userId/bookclub:", error);
  }
});

app.get("/api/bookclubs", async (req, res) => {
  try {
    const bookClubs = await getBookClubs();
    res.status(200).json(bookClubs);
  } catch (error) {
    console.log("Error in GET /api/bookclubs:", error);
    res.status(500).json({ message: "Error fetching book clubs" });
  }
});

app.delete("/api/bookclubs/:id", async (req, res) => {
  try {
    const deletedCount = await deleteBookClubById(req.params.id);
    if (deletedCount === 1) {
      res.status(200).json({ message: "Book club deleted successfully" });
    } else {
      res.status(404).json({ message: "Book club not found" });
    }
  } catch (error) {
    console.log("Error in DELETE /api/bookclubs/:id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app
  .patch("/api/bookclubs/:id", async (req, res) => {
    try {
      const bookClubId = req.params.id;
      const { description } = req.body;

      if (!description) {
        return res.status(400).json({ error: "Missing book club description" });
      }

      const modifiedCount = await updateBookClubDescription(
        bookClubId,
        description
      );

      if (modifiedCount === 0) {
        return res.status(404).json({ error: "Book club not found" });
      }

      res
        .status(200)
        .json({ message: "Book club description updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  })

  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  .listen(port, () => console.log(`Listening on port ${port}`));
