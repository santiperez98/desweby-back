const express = require('express');
const { Router } = require('express');

// Importación de Modelos
const { Producto, Usuario } = require('../db');

// Importación de Controllers
const getProductoById = require('../controllers/getControllers/getProductosById');
const getProductos = require('../controllers/getControllers/getProductos');
const postAdmin = require('../controllers/postControllers/postUsuario');
const postProductos = require('../controllers/postControllers/postProductos');

// Crear el router
const router = Router();

// Ruta para obtener productos
router.get('/productos', getProductos);

//Ruta para obtener los productos por ID
router.get('/productos/:id', getProductoById);

// Ruta para crear el administrador
router.post('/admin', postAdmin);

// Ruta para crear un nuevo producto
router.post('/', postProductos);



// Exportar el router
module.exports = router;
