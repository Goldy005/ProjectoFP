'use strict'/*Permite utilizar las nuevas funciones de JS*/

//Usar el framework express para el sistema de enrutamiento.
var express = require('express');
var PublicationController = require('../controllers/publication');

//Api para tener acceso a los metodos get, delete, post...
var api =  express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');//para la subida de archivos.
var md_upload = multipart({uploadDir: './uploads/publications'});//directorio donde se va almacenar las imagenes.

//asignamos a cada metodo su ruta.
api.get('/probando-pub',md_auth.ensureAuth,PublicationController.probando);
api.post('/publication',md_auth.ensureAuth,PublicationController.savePublication);
api.get('/publications/:page?',md_auth.ensureAuth,PublicationController.getPublications);
api.get('/publication/:id',md_auth.ensureAuth,PublicationController.getPublication);
api.delete('/publication/:id',md_auth.ensureAuth,PublicationController.deletePublication);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth,md_upload],PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile',PublicationController.getImageFile);
//Para poder exportar los metodos.
module.exports = api;