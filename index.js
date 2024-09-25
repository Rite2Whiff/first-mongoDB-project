const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./middleware");
mongoose.connect(
  "mongodb+srv://Mohit:3xGKoltLUgvTQmeX@cluster0.cq2fs.mongodb.net/mohit-todo-app"
);
const { userModel, todoModel } = require("./db");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  await userModel.create({
    name: name,
    email: email,
    password: password,
  });

  res.json({
    message: "You have successfully signed up",
  });
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const currUser = await userModel.findOne({
    email: email,
    password: password,
  });

  if (currUser) {
    const token = jwt.sign(
      {
        userId: currUser._id.toString(),
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
  } else {
    res.status(403).send({
      message: "Invalid user credentials",
    });
  }
});

app.post("/todo", auth, async (req, res) => {
  const userId = req.userId;
  const description = req.body.description;
  const isDone = false;

  await todoModel.create({
    userId: userId,
    description: description,
    isDone: isDone,
  });

  res.json({
    message: "Successfully added todo",
  });
});

app.get("/todos", auth, async (req, res) => {
  const userId = req.userId;

  const currTodo = await todoModel.findOne({
    userId: userId,
  });

  res.json({
    currTodo,
  });
});

app.listen(3000, () => {
  console.log("Your app is up and successfully running on port 3000");
});

// 3xGKoltLUgvTQmeX
