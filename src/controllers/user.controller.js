const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  // Encriptar la contraseña
  try {
    let foundUser = await User.findOne({ email });
    if (foundUser)
      return res.status(400).json({ message: "El usuario ya existe" });
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
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
      { expiresIn: 3600 },
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
