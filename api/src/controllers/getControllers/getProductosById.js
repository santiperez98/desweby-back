const { Producto } = require('../../db');

const getProductoById = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    return res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return res.status(500).json({ message: 'Error al obtener el producto.' });
  }
};

module.exports = getProductoById;  // Asegúrate de que estás exportando el controlador de forma correcta
