const { Usuario } = require('../../db');
const bcrypt = require('bcrypt');

const postAdmin = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    // Validar campos vacíos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El formato del email es inválido.' });
    }

    // Verificar si ya existe un administrador
    const existingAdmin = await Usuario.findOne({ where: { esAdmin: true } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'El administrador ya ha sido creado.' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario administrador
    const newAdmin = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      esAdmin: true, // Flag indicando que es un administrador
    });

    return res.status(201).json({
      message: 'Administrador creado exitosamente.',
      admin: {
        id: newAdmin.id,
        nombre: newAdmin.nombre,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error('Error al crear el administrador:', error);
    return res.status(500).json({ message: 'Error al crear el administrador.' });
  }
};

module.exports = postAdmin;

