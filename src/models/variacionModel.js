const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Variacion = sequelize.define('Variacion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tamaño: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    productoId: {
      type: DataTypes.UUID,
      references: {
        model: 'Producto', // Asegúrate de que el modelo Producto está correctamente registrado
        key: 'id',
      },
      allowNull: false,
    }
  }, {
    tableName: 'Variacion',
    paranoid: true,
    timestamps: true,
  });

  return Variacion;
};
