const express = require('express');
const router = require('./routes');
const routes = require('./routes');

const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}));

app.use('/', routes());

const port = 5000; 
app.listen(port)

console.log(`listening on ${port}, http://localhos:${port}`);