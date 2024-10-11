const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagenUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    precio: {
      type: DataTypes.FLOAT,   // Agregamos el precio al modelo
      allowNull: true,         // Será null si el producto tiene variaciones
    },
    stock: {
      type: DataTypes.INTEGER, // Agregamos el stock al modelo
      allowNull: true,         // Será null si el producto tiene variaciones
      defaultValue: 0,
    }
  }, {
    tableName: 'Producto',
    paranoid: true,
    timestamps: true,
  });

  return Producto;
};
