const { Producto, Variacion, Usuario } = require('../../db');

const getProductoById = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findByPk(id, {
      include: [
        {
          model: Variacion, // El modelo Variacion está correctamente asociado a Producto
          as: 'Variacions', // El alias debe coincidir con la relación en el modelo (usa el plural automáticamente si no especificaste un alias)
        },
      ],
    });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    return res.status(200).json(producto);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return res.status(500).json({ message: 'Error al obtener el producto.' });
  }
};

module.exports = getProductoById;

