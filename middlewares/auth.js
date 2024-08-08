const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  
  // Verificar si el token no fue proporcionado
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, 'secreto');
    req.usuario = decoded; // Añadir el usuario decodificado al objeto req
    next(); // Continuar con la siguiente función (la ruta protegida)
  } catch (error) {
    res.status(400).json({ error: 'Token no válido' });
  }
};

module.exports = auth;
