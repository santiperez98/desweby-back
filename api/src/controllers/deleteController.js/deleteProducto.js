const { Producto } = require('../../db');

const deleteProducto = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID del producto de los parámetros de la ruta

  try {
    // Verificar si el producto existe antes de intentar eliminarlo
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Realizamos el borrado lógico
    await producto.destroy();  // Esto hará un borrado lógico gracias a `paranoid: true`

    return res.status(200).json({ mensaje: 'Producto eliminado correctamente (borrado lógico)' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    return res.status(500).json({ mensaje: 'Error al eliminar el producto', error });
  }
};

module.exports = deleteProducto;
