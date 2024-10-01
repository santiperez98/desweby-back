const { Producto } = require('../../db'); // Ajusta la ruta a tu modelo
const cloudinary = require('cloudinary').v2; 

const updateProducto = async (req, res) => {
  const { id } = req.params; // ID del producto a modificar
  const { nombre, descripcion, precio, imagenUrl } = req.body;

  try {
    // Buscar el producto por ID
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Si hay una imagen, se sube a Cloudinary
    let nuevaImagenUrl = producto.imagenUrl; // Mantener la URL anterior si no se proporciona una nueva
    if (imagenUrl) {
      const resultado = await cloudinary.uploader.upload(imagenUrl, {
        folder: 'productos' // Puedes cambiar la carpeta donde se almacenarán las imágenes en Cloudinary
      });
      nuevaImagenUrl = resultado.secure_url; // Guardar la URL generada por Cloudinary
    }

    // Actualizar el producto con los nuevos datos
    await producto.update({
      nombre: nombre || producto.nombre,
      descripcion: descripcion || producto.descripcion,
      precio: precio || producto.precio,
      imagenUrl: nuevaImagenUrl, // Guardar la nueva URL de la imagen
    });

    return res.json({ message: 'Producto actualizado con éxito', producto });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

module.exports = updateProducto;
