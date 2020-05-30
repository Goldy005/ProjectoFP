import { Injectable } from '@angular/core' //nos permite definir los servicios y injectarlos en cualquier clase.
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http'; //para hacer peticiones ajax, para poder enviar cabeceras en cada uno de las peticiones.
import { Observable } from 'rxjs/Observable'; //para poder recoger las respuestas del api.
import { Message } from '../models/message'; // importo el modelo mensaje.
import { GLOBAL } from './global';
import { stringify } from 'querystring';

@Injectable()
export class MessageService{

    public url:String;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    //método para añadir el mensaje.
    addMessage(token:string,message:Message):Observable<any>{
        
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);
        return this._http.post(this.url+'message',params,{headers:headers});
    }

    //método para obtener mensajes
    getMyMessages(token:string,page = 1):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);
        return this._http.get(this.url+'my-messages/'+page,{headers:headers});
        
    }

    //método para obtener los mensajes enviados.
    getEmmitMessages(token:string,page = 1):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type','application/json')
                                        .set('Authorization',token);
        return this._http.get(this.url+'messages/'+page,{headers:headers});
        
    }
}