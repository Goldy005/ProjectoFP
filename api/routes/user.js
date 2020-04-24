// Usar el framework express para el sistema de enrutamiento.
const express = require('express');
const multipart = require('connect-multiparty');
const UserController = require('../controllers/user');

// Api para tener acceso a los metodos get, delete, post...
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');
// para la subida de archivos.
const mdUpload = multipart({ uploadDir: './uploads/users' }); // directorio donde se va almacenar las imagenes.

// asignamos los metodos del UserController a las rutas.

api.get('/home', UserController.home);
api.get('/pruebas', mdAuth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', mdAuth.ensureAuth, UserController.getUser);
api.get('/users/:page?', mdAuth.ensureAuth, UserController.getUsers);
api.put('/update-user/:id', mdAuth.ensureAuth, UserController.updateUser); // se usa el put para modificar los datos.
api.post(
  '/upload-image-user/:id',
  [mdAuth.ensureAuth, mdUpload],
  UserController.uploadImage
);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
api.get('/counters/:id?', mdAuth.ensureAuth, UserController.getCounters);
// Para poder exportar los metodos.
module.exports = api;
