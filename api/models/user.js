// usaremos el modelo mongoose para hace el  modelo.
const mongoose = require('mongoose');

const { Schema } = mongoose; // definir un nuevo schema.

// Definimos el modelo del usuario.
const UserSchema = Schema({
  name: String,
  surname: String,
  nick: String,
  email: String,
  password: String,
  role: String,
  image: String
});

// para poder usar el modelo usuario hay que exportalo.
module.exports = mongoose.model('User', UserSchema);
