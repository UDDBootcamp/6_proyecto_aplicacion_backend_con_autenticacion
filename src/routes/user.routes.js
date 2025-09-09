const express = require("express");
const auth = require("../middleware/authorization");

const userRouter = express.Router();
const {
  createUser,
  loginUser,
  verifyUser,
  getAllUsers,
} = require("../controllers/user.controller");

userRouter.post("/create", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/verify-user", auth, verifyUser);
userRouter.get("/", getAllUsers);


module.exports = userRouter;
