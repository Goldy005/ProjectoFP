import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router'; //importamos para redicionar las rutas.
import { User } from '../../models/user';//importamos el user.
import { UserService } from '../../services/user.service';

@Component({
    selector:'register',
    templateUrl:'./register.component.html',
    providers:[UserService]
})

//COMPONENTE REGISTER
export class RegisterComponent implements OnInit{

    public title:string;
    public user:User;
    public status:string;
    
    //Metodo se ejecuta el incio.
    ngOnInit(){
        console.log('Component de login cargado.');
    }

    //Constructor
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = 'Registrate';
        this.user = new User("","","","","","","ROLE_USER","","");
    }

    //metodo para registar el usuario.
    onSubmit(form){
        this._userService.register(this.user).subscribe(
            response => {
                if(response.user && response.user._id){

                    this.status = 'success';
                    form.reset(); //te resatea los campos  del formulario, una vez registrado.
                }else{
                    this.status = 'error';
                }
            },
            error =>{
                console.log(<any>error);
            }
        );
    }
}