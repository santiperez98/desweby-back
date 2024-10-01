// src/models/Producto.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Genera un UUID por defecto
      primaryKey: true,                // Establecer como clave primaria
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imagenUrl: {
      type: DataTypes.STRING,
      allowNull: true,  // Se almacena la URL de la imagen
    },
    usuarioId: { // Relación con Usuario
      type: DataTypes.UUID, // Cambiado a UUID
      references: {
        model: 'Usuarios', // Nombre de la tabla
        key: 'id',         // Campo clave
      },
    },
  }, {
    paranoid: true,  // Habilitar borrado lógico
    timestamps: true, // Manejo de createdAt y updatedAt
  });

  return Producto;
};
