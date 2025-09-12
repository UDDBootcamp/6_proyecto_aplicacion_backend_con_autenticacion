const Comic = require("../models/Product");

exports.createComic = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newComics = await Comic.create({ name, price, description });
    if (!newComics)
      return res.status(400).json({ message: "No se pudo crear el comic" });
    return res.status(200).json({ datos: newComics });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los comics", error: error.message });
  }
};

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

exports.getOneComic = async (req, res) => {
  try {
    const productId = req.params.id;
    const comic = await Comic.findById(productId);

    if (!comic)
      return res.status(404).json({ message: "Producto no encontrado" });

    return res.status(200).json({ producto: comic });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el comic",
      error: error.message,
    });
  }
};

exports.updateComicById = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updateComics = await Comic.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
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
