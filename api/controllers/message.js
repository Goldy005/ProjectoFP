'use strict'/*Permite utilizar las nuevas funciones de JS*/

var moment = require('moment');//para manejar el tiempo.
var mongoosePaginate = require('mongoose-pagination');//paquete que nos permite paginar.

var User = require('../models/user');//cargamos la clase User.
var Follow = require('../models/follow');//cargamos la clase User.
var Message = require('../models/message');//cargamos la clase Message.

//metodo de prueba.
function probando(req,res){
    res.status(200).send({message:'Probando desde del controladaor Message.'});
}

//metodo para almacenar los mensajes.(mensaje enviado.)
function saveMessage(req,res){
    
    var params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message:'Envía los datos necesarios.'});
    
    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = false;

    message.save((err,messageStored)=>{
        if(err) return res.status(500).send({message:'Error en la petición.'});
        
        if(!messageStored) return res.status(404).send({message:'Error al enviar el mensaje.'});
        
        return res.status(200).send({message:messageStored});
    });
}
//metodo para listar los mensajes recibidos.
function getReceivedMessages(req,res){
    
    var userId = req.user.sub;
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;
    Message.find({receiver:userId}).populate('emitter','name surname _id nick image').paginate(page,itemsPerPage,(err,messages,total)=>{
        if(err) return res.status(500).send({message:'Error en la petición.'});
        if(!messages) return res.status(404).send({message:'No hay mensajes.'});
        return res.status(200).send(
            {
                total:total,
                pages:Math.ceil(total/itemsPerPage),
                messages
            }
        );
    });
}

//metodo para listar los mensajes emitidos.
function getEmitMessages(req,res){
    
    var userId = req.user.sub;
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;
    Message.find({emitter:userId}).populate('emitter receiver','name surname _id nick image').paginate(page,itemsPerPage,(err,messages,total)=>{
        if(err) return res.status(500).send({message:'Error en la petición.'});
        if(!messages) return res.status(404).send({message:'No hay mensajes.'});
        return res.status(200).send(
            {
                total:total,
                pages:Math.ceil(total/itemsPerPage),
                messages
            }
        );
    });
}

//metodo para contar los mensajes no vistos.
function getUnviewedMessages(req,res){

    var userId = req.user.sub;

    Message.count({receiver:userId,viewed:'false'}).exec((err,count)=>{
        if(err) return res.status(500).send({message:"Error en la petición."});
        return res.status(200).send({
            'unviewed':count
        });
    });
}

//metodo para poner los mensajes como leidos.
function setViewedMessages(req,res){
    
    var userId =  req.user.sub;

    //con el multi igual a true actualizamos todos los documentos.
    Message.updateMany({receiver:userId,viewed:'false'},{viewed:'true'},{"multi":true},(err,messagesUpdated)=>{
        if(err) return res.status(500).send({message:"Error en la petición."});

        return res.status(200).send({
            messages:messagesUpdated
        });
    });
}
/*Para exportar los metodos.*/
module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmitMessages,
    getUnviewedMessages,
    setViewedMessages
}