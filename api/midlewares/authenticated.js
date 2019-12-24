'use strict'/*Permite utilizar las nuevas funciones de JS*/
/*
Comprovara si el token es correcto antes que llegue al controlador.
*/

//cargamos las librerias
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_red_social_shajinder_singh';