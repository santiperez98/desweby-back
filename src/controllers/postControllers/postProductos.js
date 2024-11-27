const { Producto, Variacion } = require('../../db');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { validate: isUuid } = require('uuid');

const postProductos = async (req, res) => {
  const { nombre, descripcion, precio, stock, usuarioId, imagenUrl, variaciones } = req.body;

  // Validaciones
  if (!nombre || typeof nombre !== 'string' || nombre.length < 3) {
    return res.status(400).json({ 
      message: 'El nombre del producto es obligatorio y debe tener al menos 3 caracteres.' 
    });
  }
  if (!usuarioId || !isUuid(usuarioId)) {
    return res.status(400).json({
      message: 'El usuarioId es obligatorio y debe ser un UUID válido.'
    });
  }
  if (!descripcion || typeof descripcion !== 'string' || descripcion.length < 10) {
    return res.status(400).json({ 
      message: 'La descripción del producto es obligatoria y debe tener al menos 10 caracteres.' 
    });
  }

  // Validación para productos sin variaciones: precio y stock obligatorios
  if ((!variaciones || !variaciones.length) && (precio === undefined || typeof precio !== 'number' || precio <= 0)) {
    return res.status(400).json({ 
      message: 'El precio del producto es obligatorio y debe ser mayor que 0 si no hay variaciones.' 
    });
  }
  if ((!variaciones || !variaciones.length) && (stock === undefined || typeof stock !== 'number' || stock < 0)) {
    return res.status(400).json({ 
      message: 'El stock del producto es obligatorio y no puede ser negativo si no hay variaciones.' 
    });
  }

  if (!imagenUrl || typeof imagenUrl !== 'string') {
    return res.status(400).json({
      message: 'La URL de la imagen es obligatoria y debe ser una cadena de texto válida.'
    });
  }

  try {
    // Subir la imagen a Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imagenUrl, { folder: 'productos' });
    const imageUrlToStore = uploadResult.secure_url;

    // Crear el producto
    const newProducto = await Producto.create({
      nombre,
      descripcion,
      precio: precio || null,   // Si tiene variaciones, precio puede ser null
      stock: stock || null,     // Si tiene variaciones, stock puede ser null
      imagenUrl: imageUrlToStore,
      usuarioId,
    });

    // Crear las variaciones si se proporcionan
    if (variaciones && Array.isArray(variaciones)) {
      for (const variacion of variaciones) {
        const { color, tamaño, precio, stock } = variacion;
        await Variacion.create({
          color,
          tamaño,
          precio,
          stock,
          productoId: newProducto.id,
        });
      }
    }

    return res.status(201).json({
      message: 'Producto creado exitosamente.',
      producto: newProducto
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    return res.status(500).json({ 
      message: 'Hubo un error al intentar crear el producto.' 
    });
  }
};

module.exports = postProductos;

