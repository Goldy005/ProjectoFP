'use strict'/*Permite utilizar las nuevas funciones de JS*/

//usaremos el modelo mongoose para hace el  modelo.
var mongoose = require('mongoose');
var Schema = mongoose.Schema; //definir un nuevo schema.

//Definimos el modelo del usuario.
var UserSchema = Schema({
    name:String,
    surname:String,
    nick:String,
    email:String,
    password:String,
    role:String,
    image:String
});

//para poder usar el modelo usuario hay que exportalo.
module.exports = mongoose.model('User',UserSchema);
