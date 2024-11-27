const express = require('express');
const { Router } = require('express');

// Importación de Modelos
const { Producto, Usuario } = require('../db');

// Importación de Controllers
const getProductoById = require('../controllers/getControllers/getProductosById');
const getProductos = require('../controllers/getControllers/getProductos');
const postAdmin = require('../controllers/postControllers/postUsuario');
const postProductos = require('../controllers/postControllers/postProductos');
const updateProducto = require('../controllers/putController/updateProducto');
const deleteProducto = require('../controllers/deleteController/deleteProducto');
const recuperarProducto = require('../controllers/putController/recuperarProducto');
const getUsuarios = require('../controllers/getControllers/getUsuarios');

// Crear el router
const router = Router();

//Ruta para obtener usuarios
router.get('/usuarios', getUsuarios);

// Ruta para obtener productos
router.get('/productos', getProductos);

//Ruta para obtener los productos por ID
router.get('/productos/:id', getProductoById);

// Ruta para crear el administrador
router.post('/admin', postAdmin);

// Ruta para crear un nuevo producto
router.post('/', postProductos);

//Ruta para modificar producto
router.put('/productos/:id', updateProducto);

//Ruta para eliminar productos
router.delete('/productos/:id', deleteProducto);

//Ruta para recuperar producto eliminado
router.put('/productos/recuperar/:id', recuperarProducto);



// Exportar el router
module.exports = router;