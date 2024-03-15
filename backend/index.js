const express = require('express');
const router = require('./routes');
const session = require('express-session');
const routes  = require('./routes');


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const { sequelize, testConnection } = require('./config/database');

// Saber las solicitudes HTTP que se envían al server.
const morgan = require('morgan');

const app = express();




// Testear la conexíon a la base de datos.
testConnection();

// Middleware
app.use(morgan("dev"));

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
    origin: 'http://10.200.80.166:3000',
    // Establecer las cookies al frontend.
    credentials: true
}));


app.use('/', routes());


const port = process.env.PORT || 5000;

// Listening on port 5000
app.listen(port);

console.log(`Server running on port ${port}`);
