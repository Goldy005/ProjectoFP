import { Component, OnInit,OnDestroy,Renderer2 } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit,OnDestroy{

    public title:string;
     // Search the tags in the DOM
    bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
    htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

    constructor(){
        this.title = 'Bienvenido a KIONUR';
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