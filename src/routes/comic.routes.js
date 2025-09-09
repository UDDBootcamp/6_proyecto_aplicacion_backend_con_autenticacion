const express = require("express");
const comicRouter = express.Router();

const {
  getAllComic,
  createComic,
  updateComicById,
  deletedComicById,
} = require("../controllers/comic.controller");

comicRouter.get("/", getAllComic);
comicRouter.post("/", createComic);
comicRouter.put("/:id", updateComicById);
comicRouter.delete("/:id", deletedComicById);

module.exports = comicRouter;
