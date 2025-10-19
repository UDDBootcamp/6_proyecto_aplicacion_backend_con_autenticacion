const User = require("../models/User");
const Cart = require("../models/Cart");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registrar usuario
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: El usuario ya existe o datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  // Encriptar la contraseña
  try {
    let foundUser = await User.findOne({ email });
    if (foundUser)
      return res.status(400).json({ message: "El usuario ya existe" });
    // encriptar la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // fin encriptar la contraseña
    const newCart = await Cart.create({});
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      cart: newCart,
    });
    if (!newUser)
      return res.status(400).json({ message: "No se pudo crear el usuario" });
    return res.status(201).json({ message: "Usuario creado", datos: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al registrar el usuario", error: error.message });
  }
};

// Login usuario
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autenticar usuario y generar token JWT
 *     description: Este endpoint permite autenticar al usuario y generar un token válido por 60 segundos, útil para pruebas temporales.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "marco@example.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       400:
 *         description: Usuario no existe o contraseña incorrecta
 *       500:
 *         description: Error interno del servidor
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let foundUser = await User.findOne({ email });
    if (!foundUser)
      return res.status(400).json({ message: "El usuario no existe" });
    const correctPassword = await bcryptjs.compare(
      password,
      foundUser.password
    );
    if (!correctPassword)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const payLoad = {
      user: {
        id: foundUser._id,
      },
    };

    // Generar el token
    jwt.sign(
      payLoad,
      process.env.SECRET,
      { expiresIn: "1h" },
      (error, token) => {
        if (error) throw error;
        const isProd = process.env.NODE_ENV === "production";
        res
          .cookie("token", token, {
            httpOnly: true,
            secure: isProd, // En producción, usar solo HTTPS
            sameSite: isProd ? "None" : "lax", // En producción, permitir cross-site
            maxAge: 60 * 60 * 1000, // 1 minuto
          })
          .json({ message: "Login exitoso" }); // también se envía el token en el cuerpo de la respuesta
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al registrar el usuario", error: error.message });
  }
};

// Verificar usuario (obtener datos del usuario autenticado)
/**
 * @swagger
 * /users/verifytoken:
 *   get:
 *     summary: Verificar usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario verificado exitosamente
 *       401:
 *         description: No autorizado. Token faltante o inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    return res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// Obtener todos los usuarios
/**
 * @swagger
 * /users/allUsers:
 *   get:
 *     summary: Obtener todos los usuarios registrados
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *       500:
 *         description: Error interno del servidor
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los usuarios", error: error.message });
  }
};

// Actualizar usuario por ID
/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
exports.updateUserById = async (req, res) => {
  try {
    const { username, email, password, country, address, zipcode } = req.body;

    const updateFields = { username, email, country, address, zipcode };

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updateUser)
      return res.status(404).json({ message: "No se encontró el usuario" });

    return res.status(200).json( updateUser );
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
  });
  return res.json({ message: "Logout exitoso" });
};
