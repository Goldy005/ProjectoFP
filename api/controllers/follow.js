'use strict'/*Permite utilizar las nuevas funciones de JS*/

/****************************CONTROLADOR DE FOLLOWERS****************************************/
var mongoosePaginate = require('mongoose-pagination');//paquete que nos permite paginar.
var fs = require('fs'); // nos permite trabajar con archivos.(librerias)
var path = require('path') //nos permite trabajar con las rutas del sistema de ficheros.(librerias)

var User = require('../models/user'); //cargamos el modelo user .
var Follow = require('../models/follow');//cargamos el modelo follower.
var mongoose = require('mongoose');


//Metodo para seguir a un usuario.
function saveFollow(req,res){
    
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;


    follow.save((err,followStored)=>{
        if(err) return res.status(500).send({message: 'Error el seguimiento.'});

        if(!followStored) return res.status(404).send({message: 'El seguimiento no se ha guardado.'});

        return res.status(200).send({follow:followStored});

    });

}
//metodo para dejar de seguir a un usuario.
function deleteFollow(req,res){

    var userId = req.user.sub;
    var followId = req.params.id;

    Follow.find({'user':userId,'followed':followId}).remove(err=>{
        if(err) return res.status(500).send({message:'Error al dejar de seguir.'});

        return res.status(200).send({message:'Has dejado de seguir a este usuario.'});
    });
}

//listar los usuarios que sigue.
function getFollowingUsers(req,res){
    
    var userId = req.user.sub;
    
    //si el id del usuario nos llegar por url esta tendra preferencia.
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;
    //numero de pagina que llega por la url
    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }

    //cantidad de seguidor por pagina
    var itemsPage = 4;

    Follow.find({user:userId}).populate('followed').paginate(page,itemsPage,(err,follows,total)=>{
        if(err) return res.status(500).send({message:'Error al dejar de seguir.'});

        if(!follows) return res.status(404).send({message:'No te sigue ningún usuario.'});

        return res.status(200).send({
            total:total,
            pages: Math.ceil(total/itemsPage),
            follows
        });
    });
}

//metodo que nos saca los usuarios que nos siguien
function getFollowedUser(req,res){
    
    var userId = req.user.sub;
    
    //si el id del usuario nos llegar por url esta tendra preferencia.
    if(req.params.id && req.params.page){
        userId = req.params.id;
    }

    var page = 1;
    //numero de pagina que llega por la url
    if(req.params.page){
        page = req.params.page;
    }else{
        page = req.params.id;
    }

    //cantidad de seguidor por pagina
    var itemsPage = 4;
    
    
    Follow.find({followed:userId}).populate('user').paginate(page,itemsPage,(err,follows,total)=>{
        if(err) return res.status(500).send({message:'Error al dejar de seguir.'});

        if(!follows) return res.status(404).send({message:'No te sigue  ningún usuario.'});

        return res.status(200).send({
            total:total,
            pages: Math.ceil(total/itemsPage),
            follows
        });
    });
}

//metodo que devuelve los usuarios que sigo y los que me siguen. 
function getMyFollows(req,res){
    
    var userId = req.user.sub;

    //usuarios que sigo si no entra en el if siguiente.
    var find = Follow.find({user:userId});

    //si me passa el id por url tengo los usuarios que me siguen.
    if(req.params.followed){
        find = Follow.find({followed:userId});
    }

    find.populate('user followed').exec((err,follows) =>{

        if(err) return res.status(500).send({message:'Error al dejar de seguir.'});

        if(!follows) return res.status(404).send({message:'No sigues a ningún usuario.'});

        return res.status(200).send({follows});
    });
}


module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUser,
    getMyFollows
}