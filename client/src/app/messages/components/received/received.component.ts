import { Component, OnInit,DoCheck  } from '@angular/core';
import { Router, ActivatedRoute,Params} from '@angular/router';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { FollowService } from '../../../services/follow.service';
import { GLOBAL } from '../../../services/global';
import { UserService } from '../../../services/user.service';


@Component({
  
  selector: 'received',
  templateUrl: './received.component.html',
  providers:[FollowService,MessageService,UserService]

})
export class ReceivedComponent implements OnInit {

    public title:string;
    public message: Message;
    public identity:any;
    public token:string;
    public url:string;
    public follows:any;
    public status:string;
    public messages: Message[];
    public page: string | number;
    public next_page: number;
    public prev_page: number;
    public total: any;
    public pages: number;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _userService: UserService,
        private _messageService: MessageService
    ) {
        this.title = 'Mensajes Enviados';
        this.identity = this._userService.getIdentity();
        //this.message = new Message('','','','',this.identity._id,'');
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('Received se ha cargado');
        this.actualPage();
    }

    actualPage(){

        this._route.params.subscribe(params =>{
            
            let page = +params['page'];
            this.page = page;

            if(!params['page']){
                page = 1;
            }
            if(!page){
                page = 1;
            }else{
                this.next_page = page+1;
                this.prev_page = page-1;

                if(this.prev_page <= 0){
                    this.prev_page = 1;
                }
            }
            this.page = page
            //devolver la lista de mensajes enviados.
            this.getMessages(this.page);
        });
    }

    //Metodo para obtener mensajes.
    getMessages(page = 1){
        this._messageService.getMyMessages(this.token,page).subscribe(
            response =>{
                if(response.messages){
                    this.messages = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;
                }
            },
            error =>{
                console.log(<any>error);
            }
        );
    }

}

