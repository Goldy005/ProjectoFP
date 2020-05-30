/** **************************CONTROLADOR DE PUBLICACIONES*************************************** */

// librerias
const path = require('path'); // nos permite trabajar con las rutas del sistema de ficheros.(librerias)
const fs = require('fs'); // nos permite trabajar con archivos.(librerias)
const moment = require('moment'); // para manejar el horas.
const mongoosePaginate = require('mongoose-pagination'); // paquete que nos permite paginar.

// modelos
const User = require('../models/user'); // cargamos el modelo user.
const Follow = require('../models/follow'); // cargamos el modelo follower.
const Publication = require('../models/publication'); // cargamos el modelo publication.

// metodo de prueba
function probando(req, res) {
  res.status(200).send({
    message: 'Hola desde del controlador Publication.'
  });
}

// metodo para almacenar una publicacion
function savePublication(req, res) {
  const params = req.body;
  if (!params.text)
    return res.status(200).send({ message: 'Debes escribir un texto.' });

  // le asignamos al modelo los valores.
  const publication = new Publication();
  publication.text = params.text;
  publication.file = 'null';
  publication.user = req.user.sub;
  publication.created_at = moment().unix();

  // guardamos la publication en db
  publication.save((err, publicationStored) => {
    if (err)
      return res
        .status(500)
        .send({ message: 'Error al guardar la publicación.' });
    if (!publicationStored)
      return res
        .status(404)
        .send({ message: 'La publicación no ha sido guardado.' });

    return res.status(200).send({ publication: publicationStored });
  });
}

// metodo para devolver lista de publicaciones, de los usuarios que sigo.
function getPublications(req, res) {
  let page = 1;

  if (req.params.page) {
    page = req.params.page;
  }

  const itemsPerPage = 4;

  Follow.find({ user: req.user.sub })
    .populate('followed')
    .exec()

    .then(follows => {
      const followClean = [];
      follows.forEach(follow => {
        followClean.push(follow.followed);
      });

      //Añadimos el usuario identificado para obtener sus publicaciones.
      followClean.push(req.user.sub);

      // busca todas las publicaciones de los usuarios que sigo.
      Publication.find({ user: { $in: followClean } })
        .sort({created_at: 'desc'})
        .populate('user')
        .paginate(page, itemsPerPage, (err, publications, total) => {
          if (err)
            return res
              .status(500)
              .send({ message: 'Error al devolver las publcicaiones.' });
          if (!publications)
            return res.status(404).send({ message: 'No hay publicaciones.' });

          return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total, itemsPerPage),
            page,
            items_per_page:itemsPerPage,
            publications
          });
        });
      // return res.status(200).send({follows});
    })
    .catch(err => {
      return handleError(err);
    });
}

// metodo para devolver lista de publicaciones, de un usuario determinado.
function getPublicationsUser(req, res) {
  let page = 1;

  if (req.params.page) {
    page = req.params.page;
  }

  let userId = req.user.sub;

  if(req.params.user){
    userId = req.params.user;
  }


  const itemsPerPage = 4;

  // busca todas las publicaciones de los usuarios que sigo.
  Publication.find({ user: userId })
    .sort({created_at: 'desc'})
    .populate('user')
    .paginate(page, itemsPerPage, (err, publications, total) => {
      if (err)
        return res
          .status(500)
          .send({ message: 'Error al devolver las publcicaiones.' });
      if (!publications)
        return res.status(404).send({ message: 'No hay publicaciones.' });

      return res.status(200).send({
        total_items: total,
        pages: Math.ceil(total, itemsPerPage),
        page,
        items_per_page:itemsPerPage,
        publications
      });
    });
      
}

// Metodo para obtener una publicacion.
function getPublication(req, res) {
  const publicationId = req.params.id;

  Publication.findById(publicationId, (err, publication) => {
    if (err)
      return res
        .status(500)
        .send({ message: 'Error al devolver las publicaciones.' });
    if (!publication)
      return res.status(404).send({ message: 'No existe la publicación.' });

    return res.status(200).send({
      publication
    });
  });
}

// metodo para elimianr las publicaciones
function deletePublication(req, res) {
  const publicationId = req.params.id;

  Publication.deleteOne(
    { user: req.user.sub, _id: publicationId },
    (err, publicationRemoved) => {
      if (err)
        return res
          .status(500)
          .send({ message: 'Error al borrar la publicación.' });

      if (!publicationRemoved)
        return res
          .status(404)
          .send({ message: 'No se ha borrado la publicación.' });

      return res.status(200).send({ publication: publicationRemoved });
    }
  );
}

// metodo para subir imagenes en la publicacion.
function uploadImage(req, res) {
  const publicationId = req.params.id;

  // solo si estamos subiendo un archivo.
  if (req.files) {
    const filePath = req.files.image.path;
    const fileSplit = filePath.split('/'); // nombre del archivo.

    // nombre de archivo
    const fileName = fileSplit[2];

    // nombre de la extensión.
    const extSplit = fileName.split('.');
    const fileExt = extSplit[1];

    // comprobamos que la extensión sea correcta.
    if (
      fileExt === 'jpg' ||
      fileExt === 'png' ||
      fileExt === 'jpeg' ||
      fileExt === 'gif'
    ) {
      // pero primero de todos tenemos que comprobar que  la publicacion sea del usuario.

      Publication.findOne({ user: req.user.sub, _id: publicationId }).exec(
        (err, publication) => {
          if (publication) {
            // Actualizamos la publicacion
            Publication.findByIdAndUpdate(
              publicationId,
              { file: fileName },
              { new: true },
              (err, publicationUpdated) => {
                if (err)
                  return res
                    .status(500)
                    .send({ message: 'Error en la petición.' });

                if (!publicationUpdated)
                  return res.status(404).send({
                    message: 'No se ha podido actualizar la publicación.'
                  });

                return res
                  .status(200)
                  .send({ publication: publicationUpdated });
              }
            );
          } else {
            return removeFilesOfUplaod(
              res,
              filePath,
              'El usuario no tiene permisos para actualizar la publicación.'
            );
          }
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
// metodo que obtiene la imagen de la publicación.
function getImageFile(req, res) {
  const image = req.params.imageFile;
  const pathFile = `./uploads/publications/${image}`;

  // comprueba si la imagen existe en la bases de datos, y si no existe muestra el erro.
  fs.exists(pathFile, exists => {
    if (exists) {
      res.sendFile(path.resolve(pathFile)); // devuelve la imagen.
    } else {
      res.status(200).send({ message: 'No existe la imagen.' });
    }
  });
}

module.exports = {
  probando,
  savePublication,
  getPublications,
  getPublication,
  deletePublication,
  uploadImage,
  getImageFile,
  getPublicationsUser
};
