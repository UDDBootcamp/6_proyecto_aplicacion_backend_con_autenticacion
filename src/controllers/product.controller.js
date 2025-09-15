const Comic = require("../models/Product");

// Crear Comic
/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: Crear un nuevo comic
 *     tags: [Comics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Batman"
 *               price:
 *                 type: number
 *                 example: 99000
 *               description:
 *                 type: string
 *                 example: "Edición especial con portada variante"
 *     responses:
 *       200:
 *         description: Comic creado exitosamente
 *       400:
 *         description: No se pudo crear el comic
 *       500:
 *         description: Error al obtener los comics
 */
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

// Obtener todos los comics
/**
 * @swagger
 * /product/readall:
 *   get:
 *     summary: Obtener todos los comics
 *     tags: [Comics]
 *     responses:
 *       200:
 *         description: Comics obtenidos exitosamente
 *       404:
 *         description: No existen comics
 *       500:
 *         description: Error interno del servidor
 */
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

// Obtener un comic por ID
/**
 * @swagger
 * /product/readone/{id}:
 *   get:
 *     summary: Obtener un comic por ID
 *     tags: [Comics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comic a buscar
 *     responses:
 *       200:
 *         description: Comic encontrado exitosamente
 *       404:
 *         description: Comic no encontrado
 *       500:
 *         description: Error al obtener el comic
 */
exports.getOneComic = async (req, res) => {
  try {
    const productId = req.params.id;
    const comic = await Comic.findById(productId);

    if (!comic)
      return res.status(404).json({ message: "Comic no encontrado" });

    return res.status(200).json({ producto: comic });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el comic",
      error: error.message,
    });
  }
};

// Actualizar un comic por ID
/**
 * @swagger
 * /product/update/{id}:
 *   put:
 *     summary: Actualizar un comic por ID
 *     tags: [Comics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comic a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Batman"
 *               price:
 *                 type: number
 *                 example: 99000
 *               description:
 *                 type: string
 *                 example: "Edición especial con portada variante"
 *     responses:
 *       200:
 *         description: Comic actualizado exitosamente
 *       404:
 *         description: No se encontro el comic
 *       500:
 *         description: Error al obtener los comics
 */
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

// Eliminar un comic por ID
/**
 * @swagger
 * /product/delete/{id}:
 *   delete:
 *     summary: Eliminar un comic por ID
 *     tags: [Comics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comic a eliminar
 *     responses:
 *       200:
 *         description: Se elimino el comic
 *       404:
 *         description: No se encontro el comic
 *       500:
 *         description: Error al obtener los comics
 */
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
