const { Producto } = require('../../db');

const recuperarProducto = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID del producto de los parámetros de la ruta

  try {
    // Buscamos el producto, incluyendo los eliminados lógicamente (paranoid: false)
    const producto = await Producto.findOne({
      where: { id },
      paranoid: false, // Incluye tanto productos eliminados como activos
    });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Restauramos el producto (lo marcamos como activo nuevamente)
    await producto.restore();

    return res.status(200).json({ mensaje: 'Producto recuperado correctamente' });
  } catch (error) {
    console.error('Error al recuperar el producto:', error);
    return res.status(500).json({ mensaje: 'Error al recuperar el producto', error });
  }
};

module.exports = recuperarProducto;
