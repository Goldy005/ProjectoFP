'use strict'/*Permite utilizar las nuevas funciones de JS*/
/*El controlador user*/

var bcrypt = require('bcrypt-nodejs');//la usaremos para encriptar la contrasenya.
var User = require('../models/user');//cargamos la clase User.
var jwt = require('../services/jwt');//importamos la clase para generar el token del usuario.

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

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}