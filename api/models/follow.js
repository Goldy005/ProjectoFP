'use strict'/*Permite utilizar las nuevas funciones de JS*/

//usaremos el modelo mongoose para hace el  modelo.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el modelo del publicaion.
var FollowSchema = Schema({
    user: { type: Schema.ObjectId, ref:'user'},
    followed: { type: Schema.ObjectId, ref:'user'}
});

//para poder usar el modelo follow hay que exportalo.
module.exports = mongoose.model('Follow',FollowSchema);