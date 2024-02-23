const express = require('express');
const router = require('./routes');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/database');
const app = express();

// Testear la conexión a la base de datos.
testConnection();

// Middleware común a ambos entornos
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Habilitar cors.
app.use(cors({
    origin: 'http://localhost:3000',
    // Establecer las cookies al frontend.
    credentials: true
}));

// Verificar si estamos en un entorno de desarrollo
if (process.env.NODE_ENV !== 'production') {
    // Saber las solicitudes HTTP que se envían al server.
    const morgan = require('morgan');
    app.use(morgan("dev"));
}

app.use('/', routes());

const port = process.env.PORT || 5000;

// Escuchar en el puerto especificado
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
