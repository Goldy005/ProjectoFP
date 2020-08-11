// usaremos el modelo mongoose para hace el  modelo.
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Definimos el modelo del Message.
const MessageSchema = Schema({
  text: { type: String,maxlength:100},
  viewed: String,
  created_at: String,
  emitter: { type: Schema.ObjectId, ref: 'User' },
  receiver: { type: Schema.ObjectId, ref: 'User' }
});

// para poder usar el message follow hay que exportalo.
module.exports = mongoose.model('Message', MessageSchema);
