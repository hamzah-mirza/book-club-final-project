//CLEANUP REQUIRED
const { MongoClient, ObjectId } = require("mongodb");

const dotenv = require("dotenv");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });
console.log(process.env.MONGO_URI);

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addComment = async (comment) => {
  const client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  console.log("Connected to MongoDB!");
  const db = client.db("BookClub");
  try {
    const collection = client.db("BookClub").collection("comments");
    const result = await collection.insertOne(comment);
    return result.insertedId;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

const getComments = async () => {
  const client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  const db = client.db("BookClub");
  try {
    const collection = client.db("BookClub").collection("comments");
    const comments = await collection.find({}).toArray();
    return comments;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

const addBookClub = async (bookClub) => {
  const client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  const db = client.db("BookClub");
  try {
    const collection = db.collection("bookclubs");
    const result = await collection.insertOne(bookClub);
    return result.insertedId;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

const getBookClubs = async () => {
  const client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  const db = client.db("BookClub");
  try {
    const collection = db.collection("bookclubs");
    const bookClubs = await collection.find({}).toArray();
    return bookClubs;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

const getBookClubById = async (id) => {
  const client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  const db = client.db("BookClub");
  try {
    const collection = db.collection("bookclubs");
    const bookClub = await collection.findOne({ _id: id });
    return bookClub;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

const addUserToBookClub = async (userId, bookClubId) => {
  const client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  const db = client.db("BookClub");
  try {
    const collection = db.collection("users");
    const result = await collection.updateOne(
      { _id: userId },
      { $set: { bookClubId: bookClubId } }
    );
    return result.modifiedCount;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

const getUserBookClub = async (userId) => {
  const client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  const db = client.db("BookClub");
  try {
    const collection = db.collection("users");
    const user = await collection.findOne({ _id: userId });
    if (user.bookClubId) {
      const bookClubCollection = db.collection("bookclubs");
      const bookClub = await bookClubCollection.findOne({
        _id: user.bookClubId,
      });
      return bookClub;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

const deleteBookClubById = async (id) => {
  const client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  const db = client.db("BookClub");
  try {
    const collection = db.collection("bookclubs");
    const result = await collection.deleteOne({ _id: id });
    return result.deletedCount;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

const updateBookClubDescription = async (id, newDescription) => {
  const client = new MongoClient(process.env.MONGO_URI, options);
  await client.connect();
  const db = client.db("BookClub");
  try {
    const collection = db.collection("bookclubs");
    const result = await collection.updateOne(
      { _id: id },
      { $set: { description: newDescription } }
    );
    return result.modifiedCount;
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};

module.exports = {
  addComment,
  getComments,
  addBookClub,
  getBookClubs,
  getBookClubById,
  addUserToBookClub,
  getUserBookClub,
  deleteBookClubById,
  updateBookClubDescription,
};
