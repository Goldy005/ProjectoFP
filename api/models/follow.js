'use strict'/*Permite utilizar las nuevas funciones de JS*/

//usaremos el modelo mongoose para hace el  modelo.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el modelo del publicaion.
var FollowSchema = Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
    followed: {  type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

//para poder usar el modelo follow hay que exportalo.
module.exports = mongoose.model('Follow',FollowSchema);