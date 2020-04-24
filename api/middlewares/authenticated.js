/*
Comprovara si el token es correcto antes que llegue al controlador.
*/

// cargamos las librerias
const jwt = require('jwt-simple');
const moment = require('moment');

let payload;

const secret = 'clave_secreta_red_social_shajinder_singh';

// req tiene los datos que recibe el metodo.
// res los datos que nosotros mandamos.
// next nos permite cargar la siguente funcion.
exports.ensureAuth = (req, res, next)=> {
  // si no es una peticion de autorización el metodo sale.
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: 'La petición no tiene la cabecera de autenticación.' });
  }

  // carga el token
  const token = req.headers.authorization.replace(/['"]+/g, ''); // quitamos la comilla simple y el doble comilla.
  // al decoficar el token este es sensible que salte el error por lo cual, lo metemos en un try catch.
  try {
    payload = jwt.decode(token, secret);

    // si la fecha del token es menor o igual la fecha actual este ha experido, hacemos un return con el mensaje de error.
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        message: 'El token ha expirado.'
      });
    }
  } catch (ex) {
    return res.status(404).send({
      message: 'El token no es válido.'
    });
  }

  // con esto tengo todos los datos en el controlador del
  req.user = payload;


  // saltamos a la siguiente acción del controlador.
  next();
};
