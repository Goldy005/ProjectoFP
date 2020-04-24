// Usar el framework express para el sistema de enrutamiento.
const express = require('express');
const MessageController = require('../controllers/message');

// Api para tener acceso a los metodos get, delete, post...
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

api.get('/probando-ms', mdAuth.ensureAuth, MessageController.probando);
api.get('/message', mdAuth.ensureAuth, MessageController.saveMessage);
api.get(
  '/my-messages/:page?',
  mdAuth.ensureAuth,
  MessageController.getReceivedMessages
);
api.get(
  '/messages/:page?',
  mdAuth.ensureAuth,
  MessageController.getEmitMessages
);
api.get(
  '/unviewed-messages',
  mdAuth.ensureAuth,
  MessageController.getUnviewedMessages
);
api.get(
  '/set-viewed-messages',
  mdAuth.ensureAuth,
  MessageController.setViewedMessages
);
module.exports = api;
