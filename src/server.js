require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");

const port = process.env.PORT || 5000;

const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // Middleware para parsear JSON

// Endpoints
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/product", productRoutes);

app.listen(port, () => {
  try {
    console.log(`Servidor corriendo en el puerto ${port}`);
  } catch (error) {
    console.log("Error al iniciar el servidor", error);
  }
});
