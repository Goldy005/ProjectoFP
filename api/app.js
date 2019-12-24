'use strict'/*Permite utilizar las nuevas funciones de JS*/

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
//midlewares es un metodo que se ejecuta antes de que llegue a un controlador.(esto ocurre por cada petición  al backend.)

app.use(bodyParser.urlencoded({extended:false})); //configuracion necesaria para el funcionamiento del bodyParser.
app.use(bodyParser.json());// cuando recibe informacion en formato JSON, automaticamente lo convertira un objeto.

//cors

//rutas
app.use('/api',user_routes);
//exportar todo lo incule la app.
module.exports = app;