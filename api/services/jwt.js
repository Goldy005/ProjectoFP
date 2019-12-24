'use strict'/*Permite utilizar las nuevas funciones de JS*/

//cargamos las librerias
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_red_social_shajinder_singh';
//generamos el token del usurio
exports.createToken = function(user){
    
    var payload = {
        
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        nick: user.nick,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix
    }

    //ciframos el token
    return jwt.encode(payload,secret);

};