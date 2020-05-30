import { Injectable } from '@angular/core' //nos permite definir los servicios y injectarlos en cualquier clase.
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http'; //para hacer peticiones ajax, para poder enviar cabeceras en cada uno de las peticiones.
import { Observable } from 'rxjs/Observable'; //para poder recoger las respuestas del api.
import { Publication } from '../models/publication'; // importo el modelo user.
import { GLOBAL } from './global';
import { stringify } from 'querystring';

@Injectable()
export class PublicationService{

    public url:string;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }


    addPublication(token : string,publication:any):Observable<any>{
        
        let params = JSON.stringify(publication);
        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);

        return this._http.post(this.url+'publication',params,{headers:headers});
    }

    getPublications(token:string,page = 1):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);

        return this._http.get(this.url+'publications/'+page,{headers:headers});

    }

    getPublicationsUser(token:string,userId:any,page = 1):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);

        return this._http.get(this.url+'publications-user/'+userId+'/'+page,{headers:headers});

    }

    deletePublication(token:string,id:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/json')
        .set('Authorization',token);

        return this._http.delete(this.url+'publication/'+id,{headers:headers});
    }

}