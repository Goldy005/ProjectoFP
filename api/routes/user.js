'use strict'/*Permite utilizar las nuevas funciones de JS*/

//Usar el framework express para el sistema de enrutamiento.
var express = require('express');
var UserController = require('../controllers/user');

//Api para tener acceso a los metodos get, delete, post...
var api =  express.Router();

//asignamos los metodos del UserController a las rutas.
api.get('/home',UserController.home);
api.get('/pruebas',UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
//Para poder exportar los metodos.
module.exports = api;