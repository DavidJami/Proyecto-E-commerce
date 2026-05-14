const mongoose = require("mongoose");

const connectDB = async () => {
    console.log('Intentando conectar a MongoDB con URI:', process.env.MONGODB_URI);
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(" Conectado a MongoDB");
    } catch (err) {
        console.error(" Error al conectar a MongoDB:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;