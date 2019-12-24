'use strict'/*Permite utilizar las nuevas funciones de JS*/

//usaremos el modelo mongoose para hace el  modelo.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Definimos el modelo del Message.
var MessageSchema = Schema({
    
    text: String,
    created_at: String,
    emitter: {type: SchemaObjectId, ref:'user'},
    receiver: {type: SchemaObjectId, ref:'user'}

});

//para poder usar el message follow hay que exportalo.
module.exports = mongoose.model('Message',MessageSchema);