const Comic = require("../models/Product");
const stripe = require("stripe")(process.env.STRIPE_KEY);

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
 *               - img
 *               - qty
 *               - isnew
 *               - currency
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
 *               img:
 *                 type: string
 *                 example: "https://upload.wikimedia.org/wikipedia/en/8/87/Batman_DC_Comics.png"
 *               qty:
 *                 type: number
 *                 example: 10
 *               isnew:
 *                 type: boolean
 *                 example: true
 *               currency:
 *                 type: string
 *                 example: clp
 *     responses:
 *       200:
 *         description: Comic creado exitosamente
 *       400:
 *         description: No se pudo crear el comic
 *       500:
 *         description: Error al obtener los comicsbbb
 */
exports.createComic = async (req, res) => {
  console.log("📌 req.body:", req.body); // Ver qué llega desde el cliente

  const {
    name,
    price,
    description,
    img,
    qty = 0,
    isnew = false,
    currency,
  } = req.body;

  if (!name || !price || !description || !img || !currency) {
    console.log("❌ Campos faltantes"); // Este log se verá si falta algo
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  console.log("✅ Todos los campos requeridos presentes");

  if (!img.startsWith("http://") && !img.startsWith("https://")) {
    console.log("❌ URL de imagen inválida"); // Este log se verá si img es inválido
    return res.status(400).json({ message: "URL de imagen inválida" });
  }

  console.log("✅ URL de imagen válida");

  try {
    const product = await stripe.products.create({
      name,
      description,
      images: [img],
      metadata: { qty: Number(qty), isnew: Boolean(isnew) },
    });
    console.log("✅ Producto Stripe creado:", product.id);

    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100),
      currency,
      product: product.id,
    });
    console.log("✅ Precio Stripe creado:", stripePrice.id);

    const newComic = await Comic.create({
      idProd: product.id,
      priceID: stripePrice.id,
      name,
      price,
      description,
      img,
      qty: Number(qty),
      isnew: Boolean(isnew),
      currency,
    });
    console.log("✅ Comic MongoDB creado:", newComic._id);

    return res.status(201).json({ datos: newComic });
  } catch (error) {
    console.error("❌ Error al crear comic:", error);
    return res
      .status(500)
      .json({ message: "Error al crear el cómic", error: error.message });
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
      .json({
        message: "Error al obtener los comics bbbh",
        error: error.message,
      });
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

    if (!comic) return res.status(404).json({ message: "Comic no encontrado" });

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
 *               img:
 *                 type: string
 *                 example: "https://upload.wikimedia.org/wikipedia/en/8/87/Batman_DC_Comics.png"
 *               qty:
 *                 type: number
 *                 example: 10
 *               isnew:
 *                 type: boolean
 *                 example: true
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
      { isnew: true, runValidators: true }
    );
    if (!updateComics)
      return res.status(404).json({ message: "No se encontro el comic" });
    return res.status(200).json({ datos: updateComics });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al obtener los comics iiiii",
        error: error.message,
      });
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
      .json({
        message: "Error al obtener los comics oooo",
        error: error.message,
      });
  }
};
