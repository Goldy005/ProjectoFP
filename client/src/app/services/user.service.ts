import { Injectable } from '@angular/core' //nos permite definir los servicios y injectarlos en cualquier clase.
import { HttpClient, HttpHeaders } from '@angular/common/http'; //para hacer peticiones ajax, para poder enviar cabeceras en cada uno de las peticiones.
import { Observable } from 'rxjs/Observable'; //para poder recoger las respuestas del api.
import { User } from '../models/user'; // importo el modelo user.
import { GLOBAL } from './global';
import { stringify } from 'querystring';

@Injectable()
export class UserService{
    
    public url:string; //url del backend
    public identity;
    public token;

    constructor(public _http:HttpClient){
        
        this.url = GLOBAL.url;
    }

    //metodo para registrar el usuario que se conecta a la api y nos devuelve una respuesta.
    register(user:User):Observable<any>{
        
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type','application/json');

        return this._http.post(this.url+'register',params,{headers:headers});
    }

    //metodo login del usuario, este se conecta a la api.
    signup(user:User,gettoken = null ):Observable<any>{
        
        if(gettoken != null){
            user.gettoken = gettoken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type','application/json');

        return this._http.post(this.url+'login',params,{headers:headers});

    }

    //metodo para obtener la identidad del usuario 
    getIdentity(){

        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;
    }


    //metodo para obtener el token del localStorage
    getToken(){

        let token = JSON.parse(localStorage.getItem('token'));

        if(token != 'undefined'){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }
}