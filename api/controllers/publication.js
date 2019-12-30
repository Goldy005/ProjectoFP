'use strict'/*Permite utilizar las nuevas funciones de JS*/

/****************************CONTROLADOR DE PUBLICACIONES****************************************/

//librerias
var path = require('path'); //nos permite trabajar con las rutas del sistema de ficheros.(librerias)
var fs = require('fs'); // nos permite trabajar con archivos.(librerias)
var moment = require('moment');//para manejar el horas.
var mongoosePaginate = require('mongoose-pagination');//paquete que nos permite paginar.

//modelos
var User = require('../models/user'); //cargamos el modelo user.
var Follow = require('../models/follow');//cargamos el modelo follower.
var Publication = require('../models/publication');// cargamos el modelo publication.


//metodo de prueba
function probando(req,res){
    res.status(200).send({
        message:'Hola desde del controlador Publication.'
    });
}

//metodo para almacenar una publicacion
function savePublication(req,res){
    
    var params = req.body;
    if(!params.text) return res.status(200).send({message:'Debes escribir un texto.'});
    
    //le asignamos al modelo los valores.
    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    //guardamos la publication en db
    publication.save((err,publicationStored)=>{
        
        if(err) return res.status(500).send({message:'Error al guardar la publicación.'});
        if(!publicationStored) return res.status(404).send({message:'La publicación no ha sido guardado.'});

        return res.status(200).send({publication:publicationStored});
    });
}

//metodo para devolver lista de publicaciones, de los usuarios que sigo.
function getPublications(req,res){

    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    Follow.find({user:req.user.sub}).populate("followed").exec()

    .then((follows)=>{
        
        var follow_clean = [];
        follows.forEach((follow)=>{
            follow_clean.push(follow.followed);
        });

        //busca todas las publicaciones de los usuarios que sigo.
        Publication.find({user:{"$in":follow_clean}}).sort('created_at').populate('user')
        .paginate(page,itemsPerPage,(err,publications,total)=>{
          
            if(err) return res.status(500).send({message:'Error al devolver las publcicaiones.'});
            if(!publications) return res.status(404).send({message:'No hay publicaciones.'});

            return res.status(200).send({
                total_items:total,
                pages:Math.ceil(total,itemsPerPage),
                page:page,
                publications
            });
        });
        //return res.status(200).send({follows});
    })
    .catch((err)=>{
        return handleError(err);
    });
}

//Metodo para obtener una publicacion.
function getPublication(req,res){

    var publicationId = req.params.id;

    Publication.findById(publicationId,(err,publication)=>{
        if(err) return res.status(500).send({message:'Error al devolver las publicaciones.'});
        if(!publication) return res.status(404).send({message:'No existe la publicación.'});

        return res.status(200).send({
            publication
        });
    })
}

//metodo para elimianr las publicaciones
function deletePublication(req,res){
    
    var publicationId = req.params.id;

    Publication.deleteOne({user:req.user.sub,'_id':publicationId},(err,publicationRemoved)=>{

        if(err) return res.status(500).send({message:'Error al borrar la publicación.'});
       
        if(!publicationRemoved) return res.status(404).send({message:'No se ha borrado la publicación.'});
       
        return res.status(200).send({publication:publicationRemoved});
    });
}

//metodo para subir imagenes en la publicacion.
function uploadImage(req,res){
    var publicationId = req.params.id;


    //solo si estamos subiendo un archivo.
    if(req.files){
        
        var file_path = req.files.image.path;
        var file_split = file_path.split('/'); //nombre del archivo.
        
        //nombre de archivo
        var file_name = file_split[2];

        //nombre de la extensión.
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        

        //comprobamos que la extensión sea correcta.
        if(file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif'){

            //pero primero de todos tenemos que comprobar que  la publicacion sea del usuario.
            
            Publication.findOne({'user':req.user.sub,'_id':publicationId}).exec((err,publication)=>{
                
                if(publication){
                    
                    //Actualizamos la publicacion
                    Publication.findByIdAndUpdate(publicationId,{file:file_name},{new:true},(err,publicationUpdated)=>{
                                
                    if(err) return res.status(500).send({ message: 'Error en la petición.'});
        
                    if(!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar la publicación.'});
        
                    return res.status(200).send({publication: publicationUpdated});
        
                    });
                }else{
                    return removeFilesOfUplaod(res,file_path,'El usuario no tiene permisos para actualizar la publicación.');
                } 

            });
        }else{
            return removeFilesOfUplaod(res,file_path,'Extensión no válida.');
        }
    }else{
        return res.status(200).send({ message: 'No se ha subido la imagen.'});
    }

}
//cada vez que se sube una imagen el midleware sube la imagen, por lo cual salta cauando salta el error hay que borralo.
function removeFilesOfUplaod(res,file_path,message){

    fs.unlink(file_path,(err) =>{
        return res.status(200).send({message: message});
    })
}
//metodo que obtiene la imagen de la publicación.
function getImageFile(req,res){

    var image = req.params.imageFile;
    var path_file = './uploads/publications/'+image;

    //comprueba si la imagen existe en la bases de datos, y si no existe muestra el erro.
    fs.exists(path_file,(exists)=>{
        if(exists){
             res.sendFile(path.resolve(path_file));//devuelve la imagen.
        }else{
             res.status(200).send({message: 'No existe la imagen.'});
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
    getImageFile
}