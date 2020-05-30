import { Injectable } from '@angular/core' //nos permite definir los servicios y injectarlos en cualquier clase.
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http'; //para hacer peticiones ajax, para poder enviar cabeceras en cada uno de las peticiones.
import { Observable } from 'rxjs/Observable'; //para poder recoger las respuestas del api.
import { Follow } from '../models/follow'; // importo el modelo user.
import { GLOBAL } from './global';
import { stringify } from 'querystring';

@Injectable()
export class FollowService{
    
    public url:String;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    addFollow(token: string | string[],follow: any):Observable<any>{

        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);

        return this._http.post(this.url+'follow',params,{headers:headers});
        
    }

    deleteFollow(token:string | string[],id:string):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);

        return this._http.delete(this.url+'follow/'+id,{headers:headers});
    }

    //metodo para obtener usuarios que sigue.
    
    getFollowing(token:string,userId = null,page = 1):Observable<any>{
        
        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);
        
        let url = this.url+'following';
        //Cuando quiero obtener los seguidores de un usuario, sino sacara los seguidores del usuario logueado.
        if(userId != null){
            url = this.url+'following/'+userId+'/'+page;
        }
        return this._http.get(url,{headers:headers});
        
    }

    //metodo para obtener usuarios que sigue.

    getFollowed(token:string,userId = null,page = 1):Observable<any>{
    
        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);
        
        let url = this.url+'followed';
        //Cuando quiero obtener los seguidores de un usuario, sino sacara los seguidores del usuario logueado.
        if(userId != null){
            url = this.url+'followed/'+userId+'/'+page;
        }
        return this._http.get(url,{headers:headers});
        
    }

    //Obtener mis seguidores.
    getMyFollows(token:string):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);

        return this._http.get(this.url+'get-my-follows/true',{headers:headers});

    
    }

}