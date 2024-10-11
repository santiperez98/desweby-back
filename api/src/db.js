require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env;

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/diamantina`, {
  logging: false,
  native: false,
});

const basename = path.basename(__filename);
const modelDefiners = [];

// Lee todos los archivos de la carpeta Models y agrégalos a modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, '/models', file)); // Asegúrate de que model sea una función
    if (typeof model === 'function') {
      modelDefiners.push(model);
    } else {
      console.error(`El archivo ${file} no exporta una función`);
    }
  });

// Inyecta la conexión (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));

// Capitaliza los nombres de los modelos
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([name, model]) => [name[0].toUpperCase() + name.slice(1), model]);
sequelize.models = Object.fromEntries(capsEntries);

// Establece las relaciones
const { Usuario, Producto, Variacion } = sequelize.models;

Usuario.hasMany(Producto, { foreignKey: 'usuarioId' });
Producto.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Producto.hasMany(Variacion, { foreignKey: 'productoId' });
Variacion.belongsTo(Producto, { foreignKey: 'productoId' });


// Exporta la conexión y los modelos
module.exports = {
  ...sequelize.models, 
  conn: sequelize,  // Exporta correctamente la conexión
};
