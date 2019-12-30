'use strict'/*Permite utilizar las nuevas funciones de JS*/

//Usar el framework express para el sistema de enrutamiento.
var express = require('express');
var MessageController = require('../controllers/message');


//Api para tener acceso a los metodos get, delete, post...
var api =  express.Router();
var md_auth = require('../middlewares/authenticated');


api.get('/probando-ms',md_auth.ensureAuth,MessageController.probando);
api.get('/message',md_auth.ensureAuth,MessageController.saveMessage);
api.get('/my-messages/:page?',md_auth.ensureAuth,MessageController.getReceivedMessages);
api.get('/messages/:page?',md_auth.ensureAuth,MessageController.getEmitMessages);
api.get('/unviewed-messages',md_auth.ensureAuth,MessageController.getUnviewedMessages);
api.get('/set-viewed-messages',md_auth.ensureAuth,MessageController.setViewedMessages);
module.exports = api;