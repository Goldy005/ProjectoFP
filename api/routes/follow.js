// Usar el framework express para el sistema de enrutamiento.
const express = require('express');
const FollowController = require('../controllers/follow');

// Api para tener acceso a los metodos get, delete, post...
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

// api.get('/pruebas-follow',mdAuth.ensureAuth,FollowContr);
api.post('/follow', mdAuth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', mdAuth.ensureAuth, FollowController.deleteFollow);
api.get(
  '/following/:id?/:page?',
  mdAuth.ensureAuth,
  FollowController.getFollowingUsers
);
api.get(
  '/followed/:id?/:page?',
  mdAuth.ensureAuth,
  FollowController.getFollowedUser
);
api.get(
  '/get-my-follows/:followed?',
  mdAuth.ensureAuth,
  FollowController.getMyFollows
);
module.exports = api;
