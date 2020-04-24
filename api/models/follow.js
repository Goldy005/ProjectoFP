// usaremos el modelo mongoose para hace el  modelo.
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Definimos el modelo del publicaion.
const FollowSchema = Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followed: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// para poder usar el modelo follow hay que exportalo.
module.exports = mongoose.model('Follow', FollowSchema);
