const bcrypt = require('bcrypt');
const { Usuario } = require('../db');

const postUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

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

    // Verificar si el email ya está registrado
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // Validar el rol (opcional, puede no enviarse y usarse el valor por defecto)
    const validRoles = ['admin', 'cliente', 'usuario'];
    if (rol && !validRoles.includes(rol)) {
      return res.status(400).json({ message: 'El rol proporcionado no es válido.' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'usuario', // Si no se envía el rol, se asigna 'usuario'
    });

    return res.status(201).json({
      message: 'Usuario creado exitosamente.',
      user: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return res.status(500).json({ message: 'Error al crear el usuario.' });
  }
};

module.exports = postUsuario;
