// usaremos el modelo mongoose para hace el  modelo.
const mongoose = require('mongoose');

const { Schema } = mongoose; // definir un nuevo schema.

// Definimos el modelo del publicaion.
const PublicationSchema = Schema({
  text: String,
  file: String,
  created_at: String,
  user: { type: Schema.ObjectId, ref: 'User' }
});

// para poder usar el modelo publication hay que exportalo.
module.exports = mongoose.model('Publication', PublicationSchema);
