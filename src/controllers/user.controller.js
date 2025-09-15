const User = require("../models/User");
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
 *                 example: "marco_dev"
 *               email:
 *                 type: string
 *                 example: "marco@example.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
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
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
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
      { expiresIn: "60s" },
      (error, token) => {
        if (error) throw error;
        return res.status(200).json({ token });
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
 *                 example: "marco_dev"
 *               email:
 *                 type: string
 *                 example: "marco@example.com"
 *               password:
 *                 type: string
 *                 example: "12345678"
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
    const { username, email, password } = req.body;
    // encriptar la contraseña
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    // fin encriptar la contraseña
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
        password: hashedPassword,
      },
      { new: true, runValidators: true }
    );
    if (!updateUser)
      return res.status(404).json({ message: "No se encontro el usuario" });
    return res.status(200).json({ datos: updateUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener al usuario", error: error.message });
  }
};
