const { Producto } = require('../../db');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const postProductos = async (req, res) => {
  const { nombre, descripcion, precio, usuarioId, imagenUrl } = req.body;

  // Validaciones
  if (!nombre || typeof nombre !== 'string' || nombre.length < 3) {
    return res.status(400).json({ 
      message: 'El nombre del producto es obligatorio y debe tener al menos 3 caracteres.' 
    });
  }
  if (!descripcion || typeof descripcion !== 'string' || descripcion.length < 10) {
    return res.status(400).json({ 
      message: 'La descripción del producto es obligatoria y debe tener al menos 10 caracteres.' 
    });
  }
  if (precio === undefined || isNaN(precio) || precio <= 0) {
    return res.status(400).json({ 
      message: 'El precio del producto es obligatorio, debe ser un número y debe ser mayor que 0.' 
    });
  }
  if (!imagenUrl) {
    return res.status(400).json({
      message: 'La URL de la imagen es obligatoria para crear el producto.'
    });
  }

  try {
    // Verificar si ya existe un producto con el mismo nombre
    const existingProducto = await Producto.findOne({
      where: {
        nombre,
      }
    });

    if (existingProducto) {
      return res.status(400).json({ 
        message: 'Ya existe un producto con ese nombre.' 
      });
    }

    // Subir la imagen a Cloudinary, ya sea URL externa o local
    const uploadResult = await cloudinary.uploader.upload(imagenUrl, {
      folder: 'productos',
    });
    const imageUrlToStore = uploadResult.secure_url;

    // Si la imagen es local, eliminarla después de subirla
    if (imagenUrl.startsWith('C:\\') || imagenUrl.startsWith('/')) {
      try {
        fs.unlinkSync(imagenUrl);
      } catch (err) {
        console.error('Error al eliminar el archivo local:', err);
      }
    }

    // Crear el producto en la base de datos
    const newProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      imagenUrl: imageUrlToStore,  // Guardar la URL de Cloudinary
      usuarioId,
    });

    // Devolver el producto creado
    return res.status(201).json(newProducto);
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return res.status(500).json({ 
      message: 'Hubo un error al intentar crear el producto. Por favor, intenta nuevamente.' 
    });
  }
};

module.exports = postProductos;
