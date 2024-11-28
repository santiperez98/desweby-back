const { Usuario } = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUsuario = async (req, res) => {
    const { email, password } = req.body;
  
    // Verificar si ambos campos están presentes
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
  
    try {
      // Verificar que el usuario exista
      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado.' });
      }
  
      // Validar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta.' });
      }
  
      // Generar un token JWT
      const token = jwt.sign(
        { id: user.id, rol: user.rol },
        process.env.JWT_SECRET, // Define esta variable en tu archivo .env
        { expiresIn: '1h' } // Expira en 1 hora
      );
  
      return res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }
  };

module.exports = loginUsuario;
