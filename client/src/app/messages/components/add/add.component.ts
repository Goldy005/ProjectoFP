import { Component, OnInit,DoCheck  } from '@angular/core';
import { Router, ActivatedRoute,Params} from '@angular/router';
import { Message } from '../../../models/message';
import { MessageService } from '../../../services/message.service';
import { FollowService } from '../../../services/follow.service';
import { GLOBAL } from '../../../services/global';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  providers:[FollowService,MessageService,UserService]
})
export class AddComponent implements OnInit {

    public title:string;
    public message: Message;
    public identity:any;
    public token:string;
    public url:string;
    public follows:any;
    public status:string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _userService: UserService,
        private _messageService: MessageService
    ) {
        this.title = 'Enviar Mensajes';
        this.identity = this._userService.getIdentity();
        this.message = new Message('','','','',this.identity._id,'');
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('Add se ha cargado');
        this.getMyFollows();
    }

    //Método para enviar mensajes.
    onSubmit(form:any){
        this._messageService.addMessage(this.token,this.message).subscribe(
            response =>{
                if(response.message){
                    this.status = 'success';
                    form.reset();
                }
            },
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }

    //metodo para obtener mis seguidores

    getMyFollows(){
        this._followService.getMyFollows(this.token).subscribe(
            response =>{
                this.follows = response.follows;
            },
            error =>{
                console.log(<any>error);
            }
        );
    }

}
