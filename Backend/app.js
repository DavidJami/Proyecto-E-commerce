// Cargar variables de entorno
require('dotenv').config();

console.log('Variables de entorno:', process.env.BASIC_USER, process.env.BASIC_PASS);

const express = require("express");
const basicAuth = require('./middlewares/basicAuth');
const connectDB = require("./config/db");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Deshabilitar header X-Powered-By para no revelar versión de Express
app.disable('x-powered-by');

// CORS configurado con dominios específicos
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: origin not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

connectDB();


app.use(cors(corsOptions));         
app.use(express.json());

app.use(basicAuth);

app.use("/barroco/products", require("./routes/productRoutes"));
app.use("/barroco/categories", require("./routes/categoryRoutes"));
app.use("/barroco/customers", require("./routes/customerRoutes"));
app.use("/barroco/shoppingCart", require('./routes/shoppingCartRoutes'));

app.get("/", (req, res) => {
  res.send("API RESTful de Barroco funcionando correctamente");
});

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
