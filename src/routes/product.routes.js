const express = require("express");
const productRouter = express.Router();

const {
  createComic,
  getAllComic,
  getOneComic,
  updateComicById,
  deletedComicById,
} = require("../controllers/product.controller");

productRouter.post("/create", createComic);
productRouter.get("/readall", getAllComic);
productRouter.get("/readone/:id", getOneComic);
productRouter.put("/update/:id", updateComicById);
productRouter.delete("/delete/:id", deletedComicById);

module.exports = productRouter;
