'use strict'/*Permite utilizar las nuevas funciones de JS*/

//usaremos el modelo mongoose para hace el  modelo.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el modelo del Message.
var MessageSchema = Schema({
    
    text: String,
    viewed: String,
    created_at: String,
    emitter: {type: Schema.ObjectId, ref:'User'},
    receiver: {type: Schema.ObjectId, ref:'User'}

});

//para poder usar el message follow hay que exportalo.
module.exports = mongoose.model('Message',MessageSchema);