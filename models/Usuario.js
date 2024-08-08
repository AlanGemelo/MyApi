const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hook para hashear la contraseña antes de guardar el usuario
Usuario.beforeCreate(async (usuario) => {
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(usuario.password, salt);
});

module.exports = Usuario;
