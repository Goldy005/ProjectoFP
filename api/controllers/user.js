'use strict'/*Permite utilizar las nuevas funciones de JS*/
/*El controlador user*/

var bcrypt = require('bcrypt-nodejs');//la usaremos para encriptar la contrasenya.
var User = require('../models/user');//cargamos la clase User.
var jwt = require('../services/jwt');//importamos la clase para generar el token del usuario.
var mongoosePaginate = require('mongoose-pagination');//paquete que nos permite paginar.
var fs = require('fs'); // nos permite trabajar con archivos.(librerias)
var path = require('path') //nos permite trabajar con las rutas del sistema de ficheros.(librerias)

function home(req,res){
    res.status(200).send({
        message:'Hola a mundo.'
    })
}

function pruebas(req,res){
    res.status(200).send({
        message:'Pruebas en el servidor NodeJS'
    })
}

//metodo para crear el usuario.
function saveUser(req,res){

    var params = req.body;
    var user  = new User();

    //si nos llegan todos los datos, se da de alta al usuario.


    if(params.name && params.surname && params.nick
        && params.email && params.password){

            user.name = params.name;
            user.surname = params.name;
            user.nick = params.nick;
            user.email = params.email;
            user.role = 'ROLE_USER';
            user.image = null;
            
            //si existe un usuario en la bases datos con el email o nombre usuario, este no se almacena. 
            User.find({ $or: [{email: user.email},
                                {nick: user.nick}
                            ]}).exec((err,users)=>{
                                if(err) return res.status(500).send({ message: 'Error a la petición del usuario.'});
                                
                                if(users && users.length >= 1){
                                    return res.status(200).send({message:'Ya existe un usuario con el mismo email o usuario.'});
                                }else{
                                    //si no existe el usuario a la base de datos lo almacena.
                                    bcrypt.hash(params.password,null,null,(err,hash)=>{
                                        user.password = hash;
                        
                                        user.save((err,userStored)=>{
                                            if(err)return res.status(500).send({message: 'Error al guardar el usuario.'})
                                            if(userStored){
                                                res.status(200).send({user:userStored});
                                            }else
                                            {
                                                res.status(404).send({message:'No se ha registrado el usuario correctamente.'});
                                            }
                                        });
                                    });
                                }
                            });
            
    }else{
        //en el caso que falta uno de los siguientes datos, enviara un
        //mensaje informando que falta todos los datos.
        res.status(200).send({
            message:'Envia todos los datos del usuario.'
        });
    }
}

//metodo para el login

function loginUser(req,res){
    
    var params = req.body;
    
    var email = params.email;
    var password = params.password;


    User.findOne({email:email},(err,user)=>{
        if(err) return res.status(500).send({message:'Error en la petición.'});
        
        if(user){
            bcrypt.compare(password,user.password,(err,check)=>{
                if(check){
                    //si existe un usuario se hará el login
                    //generamos el token
                    if(params.gettoken){
                        //generamos y devolvemos el token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }else{
                        
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                        
                }else{
                    return res.status(404).send({message:'Error no existe un usuario con este email y contraseña.'});
                }
            });
        }else{
            return res.status(404).send({message:'El usuario no se ha podido identificar.'});
        }
    });
}

//metodo para obtener información de un usuario.

function getUser(req,res){
    //se usa params para get y body post o put.

    //la id llega por la url.
    var userId = req.params.id;

    User.findById(userId,(err,user)=>{
        
        if(err) return res.status(500).send({message: 'Error en la petición.'});

        if(!user) return res.status(404).send({message: 'El usuario no existe.'});

        return res.status(200).send({user});

    });
}

//Metodo que devuelve una lista de usuarios paginado.
function getUsers(req,res){

    //obtenemos el id del usuario logueado.
    var identity_user = req.user.sub;
    var page = 1;

    //número de paginas.
    if(req.params.page){
        
        page = req.params.page;

    }

    var itemsPerPage = 5;

    //hago una busqueda de todos los usuarios que existen en la base de datos.
    User.find().sort('_id').paginate(page,itemsPerPage,(err,users,total)=>{
        if(err) return res.status(500).send({message: 'Error en la petición.'});

        if(!users) return res.status(404).send({message: 'No hay usuarios disponible.'});
        
        //devuelvo todos los usuarios, el numero de usuarios que hay en la bases de datos y las paginas que hay.
        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}

//metodo nos permite modificar los campos

function updateUser(req,res){

    var userId = req.params.id;
    var update = req.body;

    console.log(userId);
    //borrar la contraseña 
    delete update.password;

    //comprobamos que el usuario modifique sus datos 
    if(userId != req.user.sub){
        return res.status(500).send({ message: 'No tiene permisos suficiente para modificar los datos.'});
    }

    //mongoose me devuelve el objeto user original, por lo cual le tengo que pasar un tercer parametro.(new:true)
    //para que me vuelva el objeto userUpdated actualizado.
    User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{
        
        if(err) return res.status(500).send({ message: 'Error en la petición.'});

        if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario.'});

        return res.status(200).send({user: userUpdated});
    });

}

//metodo que permitara al usuario cambiar su foto de perfil.

function uploadImage(req,res){
    
    var userId = req.params.id;


        //solo si estamos subiendo un archivo.
        if(req.files){
            
            var file_path = req.files.image.path;
            var file_split = file_path.split('/'); //nombre del archivo.
            
            //nombre de archivo
            var file_name = file_split[2];

            //nombre de la extensión.
            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            //comprobamos que el usuario puede modificar su foto de perfil.
            if(userId != req.user.sub){

                return removeFilesOfUplaod(res,file_path,'No tiene permisos suficiente para modificar la foto de perfil.');
            
            }

            //comprobamos que la extensión sea correcta.
            if(file_ext == 'jpg' || file_ext == 'png' || file_ext == 'jpeg' || file_ext == 'gif'){

                User.findByIdAndUpdate(userId,{image:file_name},{new:true},(err,userUpdated)=>{
                            
                if(err) return res.status(500).send({ message: 'Error en la petición.'});

                if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario.'});

                return res.status(200).send({user: userUpdated});

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

//metodo que obtiene la imagen del usuario.
function getImageFile(req,res){

    var image = req.params.imageFile;
    var path_file = './uploads/users/'+image;

    //comprueba si la imagen existe en la bases de datos, y si no existe muestra el erro.
    fs.exists(path_file,(exists)=>{
        if(exists){
             res.sendFile(path.resolve(path_file));//devuelve la imagen.
        }else{
             res.status(200).send({message: 'No existe la imagen.'});
        }
    });
}
//nor permite llamar los metodos desde fuera.
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}