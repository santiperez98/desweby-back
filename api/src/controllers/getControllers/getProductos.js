const { Producto } = require('../../db');
const { Op } = require('sequelize');

const getProductos = async (req, res) => {
  try {
    const { nombre } = req.query; // Obtener el nombre de los parámetros de consulta
    const whereClause = {};

    // Si se proporciona un nombre, usarlo en el filtro
    if (nombre) {
      whereClause.nombre = {
        [Op.iLike]: `%${nombre}%`  // Usar Op.iLike para buscar coincidencias parciales (no sensible a mayúsculas/minúsculas)
      };
    }

    // Obtener los productos de la base de datos con la condición whereClause
    const productosDb = await Producto.findAll({
      where: whereClause,
    });

    // Si no se encuentran productos, devolver un mensaje de error
    if (productosDb.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos.' });
    }

    // Devolver los productos encontrados
    return res.status(200).json(productosDb);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los productos.' });
  }
};

module.exports = getProductos;

