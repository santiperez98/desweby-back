const { Producto, Variacion } = require('../../db');
const cloudinary = require('cloudinary').v2;

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagenUrl, variaciones, eliminarVariaciones } = req.body;

  try {
    // Buscar el producto por ID
    const producto = await Producto.findByPk(id, { include: [Variacion] });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Subir la imagen a Cloudinary si se proporciona una nueva imagen
    let nuevaImagenUrl = producto.imagenUrl;
    if (imagenUrl) {
      const resultado = await cloudinary.uploader.upload(imagenUrl, { folder: 'productos' });
      nuevaImagenUrl = resultado.secure_url;
    }

    // Actualizar el producto
    await producto.update({
      nombre: nombre || producto.nombre,
      descripcion: descripcion || producto.descripcion,
      precio: precio || producto.precio,
      imagenUrl: nuevaImagenUrl,
    });

    // Eliminar variaciones en bloque utilizando el array eliminarVariaciones
    if (eliminarVariaciones && Array.isArray(eliminarVariaciones)) {
      await Variacion.destroy({
        where: {
          id: eliminarVariaciones,
          productoId: producto.id, // Asegurar que solo se eliminen variaciones del producto actual
        },
      });
    }

    // Agregar o actualizar variaciones
    if (variaciones && Array.isArray(variaciones)) {
      for (const variacion of variaciones) {
        const { id, color, tamaño, precio, stock } = variacion;
        if (id) {
          // Actualizar la variación existente
          const variacionExistente = await Variacion.findByPk(id);
          if (variacionExistente && variacionExistente.productoId === producto.id) {
            await variacionExistente.update({
              color: color || variacionExistente.color,
              tamaño: tamaño || variacionExistente.tamaño,
              precio: precio || variacionExistente.precio,
              stock: stock !== undefined ? stock : variacionExistente.stock,
            });
          }
        } else {
          // Crear nueva variación
          if (color && precio && stock !== undefined) {
            await Variacion.create({
              color,
              tamaño: tamaño || null,
              precio,
              stock,
              productoId: producto.id,
            });
          }
        }
      }
    }

    // Reconsultar el producto para asegurarse de que se eliminen y actualicen las variaciones correctamente
    const productoActualizado = await Producto.findByPk(id, { include: [Variacion] });

    return res.json({ message: 'Producto actualizado con éxito', producto: productoActualizado });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

module.exports = updateProducto;
