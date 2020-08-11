/* El controlador user */
const bcrypt = require('bcrypt-nodejs'); // la usaremos para encriptar la contrasenya.
const mongoosePaginate = require('mongoose-pagination'); // paquete que nos permite paginar.
const fs = require('fs'); // nos permite trabajar con archivos.(librerias)
const path = require('path'); // nos permite trabajar con las rutas del sistema de ficheros.(librerias)
const User = require('../models/user'); // cargamos la clase User.
const Follow = require('../models/follow'); // cargamos la clase User.
const jwt = require('../services/jwt'); // importamos la clase para generar el token del usuario.
const Publication = require('../models/publication'); // importamos el modelo publication.

function home(req, res) {
  res.status(200).send({
    message: 'Hola a mundo.'
  });
}

function pruebas(req, res) {
  res.status(200).send({
    message: 'Pruebas en el servidor NodeJS'
  });
}

// metodo para crear el usuario.
function saveUser(req, res) {
  const params = req.body;
  const user = new User();

  // si nos llegan todos los datos, se da de alta al usuario.

  if (
    params.name &&
    params.surname &&
    params.nick &&
    params.email &&
    params.password
  ) {
    user.name = params.name;
    user.surname = params.surname;
    user.nick = params.nick;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;

    // si existe un usuario en la bases datos con el email o nombre usuario, este no se almacena.
    User.find({ $or: [{ email: user.email }, { nick: user.nick }] }).exec(
      (err, users) => {
        if (err)
          return res
            .status(500)
            .send({ message: 'Error a la petición del usuario.' });

        if (users && users.length >= 1) {
          return res.status(200).send({
            message: 'Ya existe un usuario con el mismo email o usuario.'
          });
        }
        // si no existe el usuario a la base de datos lo almacena.
        bcrypt.hash(params.password, null, null, (err, hash) => {
          user.password = hash;

          user.save((err, userStored) => {
            if (err)
              return res
                .status(500)
                .send({ message: 'Error al guardar el usuario.' });
            if (userStored) {
              res.status(200).send({ user: userStored });
            } else {
              res.status(404).send({
                message: 'No se ha registrado el usuario correctamente.'
              });
            }
          });
        });
      }
    );
  } else {
    // en el caso que falta uno de los siguientes datos, enviara un
    // mensaje informando que falta todos los datos.
    res.status(200).send({
      message: 'Envia todos los datos del usuario.'
    });
  }
}

// metodo para el login

function loginUser(req, res) {
  const params = req.body;


  const { email } = params;
  const { password } = params;

  User.findOne({ email }).select("+password").exec((err, user) => {
    if (err) return res.status(500).send({ message: 'Error en la petición.' });

    if (user) {
      bcrypt.compare(password, user.password, (err, check) => {
        if (check) {
          // si existe un usuario se hará el login
          // generamos el token
          if (params.gettoken) {
            // generamos y devolvemos el token
            return res.status(200).send({
              token: jwt.createToken(user)
            });
          }
          user.password = undefined;
          return res.status(200).send({ user });
        }
        return res.status(404).send({
          message: 'Error no existe un usuario con este email y contraseña.'
        });
      });
    } else {
      return res
        .status(404)
        .send({ message: 'El usuario no se ha podido identificar.' });
    }
  });
}

// metodo para obtener información de un usuario.

function getUser(req, res) {
  // se usa params para get y body post o put.

  // la id llega por la url.
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send({ message: 'Error en la petición.' });

    if (!user)
      return res.status(404).send({ message: 'El usuario no existe.' });

    // aquí vamos  a comprobar si el usuario nos sigue, y si también lo seguimos nosotros.
    followThisUser(req.user.sub, userId).then(value => {
      user.password = null;
      return res.status(200).send({
        user,
        following: value.following,
        followed: value.followed
      });
    });
  });
}
// se el asicrono para que las llamadas a la bases de datos se ejecutan de manera asicrona.

async function followThisUser(idenUserId, userId) {
  const following = await Follow.findOne({
    user: idenUserId,
    followed: userId
  })
    .exec()
    .then(following => {
      return following;
    })
    .catch(err => {
      return handleError(err);
    });
  const followed = await Follow.findOne({
    user: userId,
    followed: idenUserId
  })
    .exec()
    .then(followed => {
      return followed;
    })
    .catch(err => {
      return handleError(err);
    });

  return {
    following,
    followed
  };
}

// Metodo que devuelve una lista de usuarios paginado.
function getUsers(req, res) {
  // obtenemos el id del usuario logueado.
  const identityUser = req.user.sub;
  let page = 1;

  // número de paginas.
  if (req.params.page) {
    page = req.params.page;
  }

  const itemsPerPage = 5;

  // hago una busqueda de todos los usuarios que existen en la base de datos.
  User.find()
    .sort('_id')
    .paginate(page, itemsPerPage, (err, users, total) => {
      if (err)
        return res.status(500).send({ message: 'Error en la petición.' });

      if (!users)
        return res.status(404).send({ message: 'No hay usuarios disponible.' });

      followeUserIds(identityUser).then(value => {
        return res.status(200).send({
          users,
          users_following: value.following,
          users_follow_me: value.followed,
          total,
          pages: Math.ceil(total / itemsPerPage)
        });
      });

      // devuelvo todos los usuarios, el numero de usuarios que hay en la bases de datos y las paginas que hay.
    });
}
// metodo que nos saca listado de ID de usuarios que nos sigue y seguimos.
async function followeUserIds(userId) {
  const following = await Follow.find({ user: userId })
    .select({ _id: 0, __v: 0, user: 0 })
    .exec()

    .then(follows => {
      const followClean = [];
      follows.forEach(follow => {
        followClean.push(follow.followed);
      });
      return followClean;
    })
    .catch(err => {
      return handleError(err);
    });

  const followed = await Follow.find({ followed: userId })
    .select({ _id: 0, __v: 0, followed: 0 })
    .exec()

    .then(follows => {
      const followClean = [];
      follows.forEach(follow => {
        followClean.push(follow.user);
      });
      return followClean;
    })
    .catch(err => {
      return handleError(err);
    });

  return {
    following,
    followed
  };
}

// metodo nos permite modificar los campos

function updateUser(req, res) {

  const userId = req.params.id;
  const update = JSON.parse(req.body.user);


  // borrar la contraseña
  delete update.password;

  // comprobamos que el usuario modifique sus datos
  if (userId !== req.user.sub) {
    return res.status(500).send({
      message: 'No tiene permisos suficiente para modificar los datos.'
    });
  }

  
  User.find({ $or: [{ email: update.email }, { nick: update.nick }] }).exec((err,users)=>{
   
    var userExiste = false;
    users.forEach((user)=>{
      if(user && user._id != userId) {
        userExiste = true;
      }
    });

    console.log('sha'+userExiste);

    if(userExiste){
      console.log('entra');
      return res.status(404).send({message:'Los datos ya están en uso.'});
    } 
    
    // mongoose me devuelve el objeto user original, por lo cual le tengo que pasar un tercer parametro.(new:true)
    // para que me vuelva el objeto userUpdated actualizado.
    User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
      
      if (err) return res.status(500).send({ message: 'Error en la petición.' });
  
      if (!userUpdated)
        return res
          .status(404)
          .send({ message: 'No se ha podido actualizar el usuario.' });
  
      return res.status(200).send({ user: userUpdated });
    });
  });


}

// metodo que permitara al usuario cambiar su foto de perfil.

function uploadImage(req, res) {
  const userId = req.params.id;

  // solo si estamos subiendo un archivo.
  if (req.files) {
    const filePath = req.files.image.path;
    const fileSplit = filePath.split('/'); // nombre del archivo.

    // nombre de archivo
    const fileName = fileSplit[2];

    // nombre de la extensión.
    const extSplit = fileName.split('.');
    const fileExt = extSplit[1];

    // comprobamos que el usuario puede modificar su foto de perfil.
    if (userId !== req.user.sub) {
      return removeFilesOfUplaod(
        res,
        filePath,
        'No tiene permisos suficiente para modificar la foto de perfil.'
      );
    }

    // comprobamos que la extensión sea correcta.
    if (
      fileExt == 'jpg' ||
      fileExt == 'png' ||
      fileExt == 'jpeg' ||
      fileExt == 'gif'
    ) {
      User.findByIdAndUpdate(
        userId,
        { image: fileName },
        { new: true },
        (err, userUpdated) => {
          if (err)
            return res.status(500).send({ message: 'Error en la petición.' });

          if (!userUpdated)
            return res
              .status(404)
              .send({ message: 'No se ha podido actualizar el usuario.' });

          return res.status(200).send({ user: userUpdated });
        }
      );
    } else {
      return removeFilesOfUplaod(res, filePath, 'Extensión no válida.');
    }
  } else {
    return res.status(200).send({ message: 'No se ha subido la imagen.' });
  }
}

// cada vez que se sube una imagen el midleware sube la imagen, por lo cual salta cauando salta el error hay que borralo.
function removeFilesOfUplaod(res, filePath, message) {
  fs.unlink(filePath, err => {
    return res.status(200).send({ message });
  });
}

// metodo que obtiene la imagen del usuario.
function getImageFile(req, res) {
  const image = req.params.imageFile;
  const pathFile = `./uploads/users/${image}`;

  // comprueba si la imagen existe en la bases de datos, y si no existe muestra el erro.
  fs.exists(pathFile, exists => {
    if (exists) {
      res.sendFile(path.resolve(pathFile)); // devuelve la imagen.
    } else {
      res.status(200).send({ message: 'No existe la imagen.' });
    }
  });
}

// metodo para obtener los seguidores y a los que sigue un usuario.
function getCounters(req, res) {
  let userId = req.user.sub;
  console.log(userId);
  if (req.params.id) {
    userId = req.params.id;
  }

  getCountFollow(userId)
    .then(value => {
      return res.status(200).send(value);
    })

    .catch(err => {
      return handleError(err);
    });
}

// metodo para contar los seguidores y a los que sigue.
async function getCountFollow(userId) {
  const following = await Follow.countDocuments({ user: userId })
    .exec()

    .then(count => {
      return count;
    })

    .catch(err => {
      return handleError(err);
    });

  const followed = await Follow.countDocuments({ followed: userId })
    .exec()

    .then(count => {
      return count;
    })

    .catch(err => {
      return handleError(err);
    });

  const publication = await Publication.countDocuments({ user: userId })
    .exec()

    .then(count => {
      return count;
    })
    .catch(err => {
      return handleError(err);
    });

  return {
    following,
    followed,
    publication
  };
}
// nor permite llamar los metodos desde fuera.
module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  uploadImage,
  getImageFile,
  getCounters
};
