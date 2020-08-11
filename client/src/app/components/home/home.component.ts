import { Component, OnInit,OnDestroy,Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service'; //Cargo el user service.
import { Router,ActivatedRoute, Params } from '@angular/router'; // Para redirigir las rutas.
@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit,OnDestroy{

    public title:string;
     // Search the tags in the DOM
    bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
    htmlTag: HTMLElement = document.getElementsByTagName('html')[0];
    public identity:any;


    constructor(
        private _route:ActivatedRoute,
        private _router:Router,
        private _userService:UserService
    ){
        this.title = 'Bienvenido a KIONUR';
        this.identity = this._userService.getIdentity();
    }

    ngOnInit(){

            this.bodyTag.classList.add('home-page');
            this.htmlTag.classList.add('home-page');
            const nav = document.getElementsByTagName('nav')[0];
            nav.classList.add('nav-background');
            //this.document.body.classList.add('test');
    }

    ngOnDestroy() {

        // remove the the body classes
        this.bodyTag.classList.remove('home-page');
        this.htmlTag.classList.remove('home-page');

  }

}