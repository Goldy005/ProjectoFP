import { Component,OnInit,DoCheck } from '@angular/core';
import { UserService } from './services/user.service'; //Cargo el user service.
import { Router,ActivatedRoute, Params } from '@angular/router'; // Para redirigir las rutas.
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit,DoCheck {

  public title:string;
  public identity;
  public url:string;

  constructor(
    
    private _route:ActivatedRoute,
    private _router:Router,
    private _userService:UserService

  ){
    this.title = 'KIONUR';
    this.url = GLOBAL.url;
  }


  ngOnInit(){

    this.identity = this._userService.getIdentity();
    if(this.identity != null){
      this._router.navigate(['/home']);
    }
  }
  /*Cada vez que se produce un cambio, la idententidad de usuarios se actualizará.*/
  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  /*Método para cerrar sesión.*/
  logout(){
    
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/']);

    const body = document.getElementsByTagName('nav')[0];
    body.classList.remove('nav-background');

  }

  redirect(){
    this._router.navigate(['/home']);
  }


}
