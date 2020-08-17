
/*Index como punto de partida para lanzar el backend, realiza la conexión a mongodb y 
también se realiza la conexión a un servidor nodejs*/

/*Para conectarnos a la base de datos vamos usar mongoose y cargamos la libreria mongoose. */
const mongoose = require('mongoose');
const app = require('./app');//cargamos todos los paquetes y librerias.
//const port = 3800;

const port = process.env.PORT || 8080;

/*Para conectarse a mongoDB se tiene que utilizar las promesas. */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/red_social',{
    useNewUrlParser: true,
    useUnifiedTopology : true,
    useFindAndModify : false
  })

//useMongoClient a true  se conecta a mongoDB como cliente.

//metodo then si se conecta a la bases de datos.
                    .then(()=>{
                        console.log('Se ha conectado a la base de datos red_social correctamente.');

                        //Crear servidor
                        app.listen(port,()=>{
                            console.log("servidor corriendo en http://localhost:3800");
                        });
                    })
                    // si no se conecta a la base a datos, nos mostrar error a la consola.
                    .catch(err => console.log(err));
