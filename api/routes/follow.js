'use strict'/*Permite utilizar las nuevas funciones de JS*/

//Usar el framework express para el sistema de enrutamiento.
var express = require('express');
var FollowController = require('../controllers/follow');

//Api para tener acceso a los metodos get, delete, post...
var api =  express.Router();
var md_auth = require('../middlewares/authenticated');


//api.get('/pruebas-follow',md_auth.ensureAuth,FollowContr);
api.post('/follow',md_auth.ensureAuth,FollowController.saveFollow);
api.delete('/follow/:id',md_auth.ensureAuth,FollowController.deleteFollow);
api.get('/following/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowedUser);
api.get('/get-my-follows/:followed?',md_auth.ensureAuth,FollowController.getMyFollows);
module.exports = api;