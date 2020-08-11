// usaremos el modelo mongoose para hace el  modelo.
const mongoose = require('mongoose');

const { Schema } = mongoose; // definir un nuevo schema.

// Definimos el modelo del usuario.
const UserSchema = Schema({
  name: { type: String,maxlength:15},
  surname: { type: String,maxlength:26},
  nick: { type: String,maxlength:26},
  email: { type: String,maxlength:90},
  password: { type: String, select: false },
  role: String,
  image: String
});

// para poder usar el modelo usuario hay que exportalo.
module.exports = mongoose.model('User', UserSchema);
