const { Producto, Variacion } = require('../../db');
const { Op } = require('sequelize');

const getProductos = async (req, res) => {
  try {
    const { nombre } = req.query;  // Obtener el nombre de los parámetros de consulta
    const whereClause = {};

    // Si se proporciona un nombre, usarlo en el filtro
    if (nombre) {
      whereClause.nombre = {
        [Op.iLike]: `%${nombre}%`,  // Usar Op.iLike para buscar coincidencias parciales (no sensible a mayúsculas/minúsculas)
      };
    }

    // Obtener los productos de la base de datos con la condición whereClause
    const productosDb = await Producto.findAll({
      where: whereClause,
      include: {
        model: Variacion,
        attributes: ['color', 'tamaño', 'precio', 'stock'], // Campos de variación que deseas incluir
      },
      attributes: ['id', 'nombre', 'descripcion', 'precio', 'imagenUrl', 'usuarioId'], // Atributos del producto que deseas incluir
    });

    // Si no se encuentran productos, devolver un mensaje de error
    if (productosDb.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos.' });
    }

    // Transformar los productos para agregar más detalles en caso de que no tengan variaciones
    const productosConDetalles = productosDb.map(producto => {
      const productoData = producto.get({ plain: true }); // Obtener datos planos del producto
      if (productoData.Variacions.length === 0) {
        // Si no hay variaciones, devolver todos los detalles del producto
        return {
          ...productoData,
          mensaje: 'Este producto no tiene variaciones.',
        };
      }
      return productoData;  // Si tiene variaciones, devolver el producto con sus variaciones
    });

    // Devolver los productos con sus detalles y/o variaciones
    return res.status(200).json(productosConDetalles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los productos.' });
  }
};

module.exports = getProductos;
