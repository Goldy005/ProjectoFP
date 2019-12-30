'use strict'/*Permite utilizar las nuevas funciones de JS*/

//app.js se encarga de cargar los ficheros.


/*Cargamos todos los paquetes y librerias.*/

/*Express framework nos proporciona funcionalidades como el  enrutamiento, 
opciones para gestionar sesiones y cookies... */
var express = require('express');
/*Body parse permite convertir el JSON en un objeto de JS. */
var bodyParser = require('body-parser');

//cargar el framework
var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');
//midlewares es un metodo que se ejecuta antes de que llegue a un controlador.(esto ocurre por cada petición  al backend.)

app.use(bodyParser.urlencoded({extended:false})); //configuracion necesaria para el funcionamiento del bodyParser.
app.use(bodyParser.json());// cuando recibe informacion en formato JSON, automaticamente lo convertira un objeto.

//rutas
app.use('/api',user_routes);
app.use('/api',follow_routes);
app.use('/api',publication_routes);
app.use('/api',message_routes);
//exportar todo lo incule la app.
module.exports = app;