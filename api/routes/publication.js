/* Permite utilizar las nuevas funciones de JS */

// Usar el framework express para el sistema de enrutamiento.
const express = require('express');
const multipart = require('connect-multiparty');
const PublicationController = require('../controllers/publication');

// Api para tener acceso a los metodos get, delete, post...
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');
// para la subida de archivos.
const mdUpload = multipart({ uploadDir: './uploads/publications' }); // directorio donde se va almacenar las imagenes.

// asignamos a cada metodo su ruta.
api.get('/probando-pub', mdAuth.ensureAuth, PublicationController.probando);
api.post(
  '/publication',
  mdAuth.ensureAuth,
  PublicationController.savePublication
);
api.get(
  '/publications/:page?',
  mdAuth.ensureAuth,
  PublicationController.getPublications
);
api.get(
  '/publication/:id',
  mdAuth.ensureAuth,
  PublicationController.getPublication
);
api.delete(
  '/publication/:id',
  mdAuth.ensureAuth,
  PublicationController.deletePublication
);
api.post(
  '/upload-image-pub/:id',
  [mdAuth.ensureAuth, mdUpload],
  PublicationController.uploadImage
);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);
// Para poder exportar los metodos.
module.exports = api;
