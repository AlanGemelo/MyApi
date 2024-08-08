const express = require('express');
const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mercadopago = require('mercadopago');

const app = express();
app.use(express.json());
const punycode = require('punycode/');


// Sincronizar la base de datos
sequelize.sync();
// Rutas
// app.get('/productos', async (req, res) => {
//   const productos = await Producto.findAll();
//   res.json(productos);
// });

// app.post('/productos', async (req, res) => {
//   const nuevoProducto = await Producto.create(req.body);
//   res.json(nuevoProducto);
// });


// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


app.get('/', (req, res) => {
    res.send('Hola mundo');
});


app.post('/pago', async (req, res) => {
  const { title, quantity, price } = req.body;

  let preference = {
    items: [{
      title: title,
      quantity: quantity,
      currency_id: 'ARS',
      unit_price: price,
    }],
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para registrar nuevos usuarios
app.post('/register', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Validar que los datos no estén vacíos
        if (!nombre || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios: nombre, email, password' });
        }

        // Verificar si el correo ya existe
        const existingUser = await Usuario.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Crear el usuario si el correo no existe
        let usuario = await Usuario.create({ nombre, email, password });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


  
  // Implementación del login
  app.post('/login', async (req, res) => {
            // Validar que los datos no estén vacíos
            try {
                const { email, password } = req.body;
                
                if ( !email || !password) {
                    return res.status(400).json({ error: 'Todos los campos son obligatorios: nombre, email, password' });
                }
      // Buscar al usuario por email
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Comparar la contraseña
      const isMatch = await bcrypt.compare(password, usuario.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }
  
      // Generar un token JWT
      const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, 'secreto', {
        expiresIn: '1h', // El token expirará en 1 hora
      });
  
      res.json({ token,success:true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Rutas protegidas y otras rutas...
  
  // Puerto del servidor
