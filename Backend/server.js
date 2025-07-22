const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");

const port = 3500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//mongoose schema and model
const userSchema = new mongoose.Schema({
  name: String,
  password: String,
});
const RegisteredUser = mongoose.model("RegisteredUser", userSchema);

// Replace with your MongoDB URI
const mongoURI = "mongodb://localhost:27017/myDatabase";

//Below will avoid the deprecation warnings
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB connection
const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

//post request to receive data from the frontend
app.post("/register", async (req, res) => {
  try {
    const { name, password, confirmPassword } = req.body;
    console.log("Received data:", { name, password, confirmPassword });
    if (!name || !password || !confirmPassword) {
      return res.status(400).json({ message: "All Inputs must be required" });
    } else {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      } else {
        const newUser = new RegisteredUser({ name, password });
        await newUser.save();
        res.status(201).json({
          message: "Data received successfully",
          data: newUser,
        });
      }
    }
  } catch (error) {
    console.log("Error in /register:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//Get request to fetch all users

app.get("/users", async (req, res) => {
  try {
    const users = await RegisteredUser.find();
    console.log("Fetched users:", users.slice(-5));
    res.status(200).json(users.slice(-5)); // Return the last 5 users
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
