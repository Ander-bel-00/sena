require('dotenv').config();
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars').create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
});
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const routes = require('./routes');
const { sequelize, testConnection } = require('./config/database');


const app = express();

// Testear la conexión a la base de datos.
testConnection();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'my-secret-key', // Cambia esto por tu propia clave secreta
    resave: false,
    saveUninitialized: true
}));

// Habilitar cors.
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://192.168.1.22:3000',
    credentials: true // Establecer las cookies al frontend.
}));

// Configurar Handlebars como motor de plantillas
app.engine('hbs', exphbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', routes());

const port = process.env.PORT || 5000;

// Listening on port 5000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
