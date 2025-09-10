const Comic = require("../models/Comic");

exports.getAllComic = async (req, res) => {
  try {
    const comics = await Comic.find();
    return res.status(200).json({ comics });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los comics", error: error.message });
  }
};

exports.createComic = async (req, res) => {
  try {
    const { name, price } = req.body;
    const newComics = await Comic.create({ name, price });
    if (!newComics)
      return res.status(400).json({ message: "No se pudo crear el comic" });
    return res.status(200).json({ datos: newComics });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los comics", error: error.message });
  }
};

exports.updateComicById = async (req, res) => {
  try {
    const { name, price } = req.body;
    const updateComics = await Comic.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
      },
      { new: true, runValidators: true }
    );
    if (!updateComics)
      return res.status(404).json({ message: "No se encontro el comic" });
    return res.status(200).json({ datos: updateComics });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los comics", error: error.message });
  }
};

exports.deletedComicById = async (req, res) => {
  try {
    const deletedComics = await Comic.findByIdAndDelete(req.params.id);
    if (!deletedComics)
      return res.status(404).json({ message: "No se encontro el comic" });
    return res.status(200).json({ message: "Se elimino el comic" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los comics", error: error.message });
  }
};

// readone/:id