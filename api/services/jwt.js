// cargamos las librerias
const jwt = require('jwt-simple');
const moment = require('moment');

const secret = 'clave_secreta_red_social_shajinder_singh';
// generamos el token del usurio
exports.createToken = function(user) {
  const payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    nick: user.nick,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix
  };

  // ciframos el token
  return jwt.encode(payload, secret);
};
