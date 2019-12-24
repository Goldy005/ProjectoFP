'use strict'/*Permite utilizar las nuevas funciones de JS*/

//Usar el framework express para el sistema de enrutamiento.
var express = require('express');
var UserController = require('../controllers/user');

//Api para tener acceso a los metodos get, delete, post...
var api =  express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');//para la subida de archivos.
var md_upload = multipart({uploadDir: './uploads/users'});//directorio donde se va almacenar las imagenes.


//asignamos los metodos del UserController a las rutas.

api.get('/home',UserController.home);
api.get('/pruebas',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser); //se usa el put para modificar los datos.
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);
api.get('/get-image-user/:imageFile',UserController.getImageFile);
//Para poder exportar los metodos.
module.exports = api;