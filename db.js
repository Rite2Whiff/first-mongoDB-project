const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  email: String,
  password: String,
  name: String,
});

const Todo = new Schema({
  description: String,
  isDone: Boolean,
  userId: ObjectId,
});

const userModel = mongoose.model("users", User);
const todoModel = mongoose.model("todo-list", Todo);

module.exports = {
  userModel,
  todoModel,
};
