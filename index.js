const express = require("express");
const bcrypt = require("bcrypt");
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

  const hashedPassword = await bcrypt.hash(password, 2);

  await userModel.create({
    name: name,
    email: email,
    password: hashedPassword,
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
  });

  if (!currUser) {
    res.status(403).send({
      message: "User does not exist in our database",
    });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, currUser.password);

  if (passwordMatch) {
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

app.put("/todo-mark", auth, async (req, res) => {
  const userId = req.userId;

  const currTodo = await todoModel.findOne({
    userId: userId,
  });

  if (!currTodo) {
    res.send({
      message: "Item not found",
    });
    return;
  }

  await todoModel.updateOne({
    isDone: true,
  });

  res.send({
    message: "Item updated sucessfully",
  });
});

app.delete("/todo-delete", auth, async (req, res) => {
  const userId = req.userId;
  const currTodo = await todoModel.findOne({
    userId: userId,
  });

  if (!currTodo) {
    res.send({
      message: "Item not found",
    });
    return;
  }

  await todoModel.deleteOne(currTodo);

  res.send({
    message: "Todo deleted successfully",
  });
});

app.listen(3000, () => {
  console.log("Your app is up and successfully running on port 3000");
});
