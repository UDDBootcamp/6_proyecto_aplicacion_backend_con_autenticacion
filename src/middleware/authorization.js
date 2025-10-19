const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  let token = req.cookies.token || "";
  if (!token)
    return res.status(401).json({ message: "No hay token, permiso no válido" });

  try {
    const openToken = jwt.verify(token, process.env.SECRET);
    req.user = openToken.user;
    next(); // pasa al siguiente middleware o ruta
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token no válido o expirado", error });
  }

  // Leer el token del header
  // let { authorization } = req.headers;
  // if (!authorization)
  //   return res.status(401).json({ message: "No hay token, permiso no válido" });
  // try {
  //   let [type, token] = authorization.split(" ");
  //   if (type === "Token" || type === "Bearer") {
  //     const openToken = jwt.verify(token, process.env.SECRET);
  //     req.user = openToken.user;
  //     next();
  //   } else {
  //     return res.status(401).json({ message: "Acceso no autorizado" });
  //   }
  // } catch (error) {
  //   return res.status(401).json({ message: "Token no válido o expirado" });
  // }
};
