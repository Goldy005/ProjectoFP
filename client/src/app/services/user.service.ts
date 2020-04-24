import { Injectable } from '@angular/core' //nos permite definir los servicios y injectarlos en cualquier clase.
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http'; //para hacer peticiones ajax, para poder enviar cabeceras en cada uno de las peticiones.
import { Observable } from 'rxjs/Observable'; //para poder recoger las respuestas del api.
import { User } from '../models/user'; // importo el modelo user.
import { GLOBAL } from './global';
import { stringify } from 'querystring';

@Injectable()
export class UserService{
    
    public url:string; //url del backend
    public identity;
    public token;
    public stats;

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
    signup(user: User,gettoken = null ):Observable<any>{
        
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

        let token = localStorage.getItem('token');
        //let token = JSON.parse(localStorage.getItem('token'));

            if(token != 'undefined'){
                this.token = token;
            }else{
                this.token = null;
            }
    
        return this.token;
    }

    getStats(){

        let stats = localStorage.getItem('stats');

        if(stats != 'undefined'){
            this.stats = stats;
        }else{
            this.stats = null;
        }

        return this.stats;

    }

    //metodo para obtener las estadisticas del usuario.
    
    getCounters(userId = null): Observable<any>{
        
        let headers = new HttpHeaders().set('Content-Type','aplication/json')
                                       .set('Authorization',this.getToken());
        if(userId != null){
            return this._http.get(this.url+'counters/'+userId,{headers:headers});
        }else{
            return this._http.get(this.url+'counters/',{headers:headers});
        }
    }

    //metodo para actualizar los usuarios.
    updateUser(user:User):Observable<any>{
        

        const params = new HttpParams()
        .set('user', JSON.stringify(user));
        
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                       .set('Authorization',this.getToken());
                                       
        
       return this._http.put(this.url+'update-user/'+user._id,params,{headers:headers});

    }

    //metodo para obtener los usuarios.
    getUsers(page = null):Observable<any>{
        
        let headers = new HttpHeaders().set('Content-Type','aplication/json')
                                       .set('Authorization',this.getToken());

        return this._http.get(this.url+'users/'+page,{headers:headers});
    }

    //metodo para obtener información de usuario.
    getUser(id):Observable<any>{
        
        let headers = new HttpHeaders().set('Content-Type','aplication/json')
                                       .set('Authorization',this.getToken());

        return this._http.get(this.url+'user/'+id,{headers:headers});
    }
}