'use strict'/*Permite utilizar las nuevas funciones de JS*/

//usaremos el modelo mongoose para hace el  modelo.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;//definir un nuevo schema.

//Definimos el modelo del publicaion.
var PublicationSchema = Schema({
    
    text: String,
    file: String,
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User'}

});

//para poder usar el modelo publication hay que exportalo.
module.exports = mongoose.model('Publication',PublicationSchema);
