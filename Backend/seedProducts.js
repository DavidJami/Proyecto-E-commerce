const mongoose = require('mongoose');
const Product = require('./models/product'); // Asegúrate de que el modelo esté correctamente definido
require('dotenv').config();

// Conexión a MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Productos de prueba
const products = [
  { idProduct: 'P001', name: 'Producto 1', price: 10.99, description: 'Descripción del producto 1', stock: 100 },
  { idProduct: 'P002', name: 'Producto 2', price: 20.99, description: 'Descripción del producto 2', stock: 50 },
  { idProduct: 'P003', name: 'Producto 3', price: 15.49, description: 'Descripción del producto 3', stock: 75 },
];

// Insertar productos
const seedProducts = async () => {
  try {
    await Product.deleteMany(); // Limpia la colección antes de insertar
    await Product.insertMany(products);
    console.log('Productos insertados correctamente');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error al insertar productos:', err);
    mongoose.connection.close();
  }
};

seedProducts();