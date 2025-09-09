const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  // Leer el token del header
  let {authorization} = req.headers;
  if (!authorization)
    return res.status(401).json({ message: "No hay token, permiso no válido" });
  try {
    let [type, token] = authorization.split(" ");
    if (type === "Token" || type === "Bearer") {
     const openToken = jwt.verify(token, process.env.SECRET);
     req.user = openToken.user;
     next();
    } else {
      return res
        .status(401)
        .json({ message: "Acceso no autorizado" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token no válido" });
  }
};
