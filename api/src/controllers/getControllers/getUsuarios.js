const { Usuario } = require('../../db'); // Asegúrate de que la ruta sea correcta

const getUsuarios = async (req, res) => {
  try {
    const usuariosDb = await Usuario.findAll({
      attributes: { exclude: ['password'] } // Excluye el campo 'password'
    });

    if (usuariosDb.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios.' });
    }

    return res.status(200).json(usuariosDb);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los usuarios.' });
  }
};

module.exports = getUsuarios;

