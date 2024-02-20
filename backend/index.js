const express = require('express');
const router = require('./routes');
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



// Habilitar cors.
app.use(cors({
    origin: 'http://localhost:3000',
    // Establecer las cookies al frontend.
    credentials: true
}));

// Para evitar el almacenamiento en caché en el navegador
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});
  


app.use('/', routes());


const port = process.env.PORT || 5000;

// Listening on port 5000
app.listen(port);

