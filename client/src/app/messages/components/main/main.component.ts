import { Component,OnInit,OnDestroy } from '@angular/core';


@Component({
  selector: 'main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

    public title:string;

    // Search the tags in the DOM
    bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
    htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

    constructor() {
        this.title = 'Mensajes privados'; 
    }

    ngOnInit() {
        //console.log('Main se ha cargado');
        this.bodyTag.classList.add('home-page');
        this.htmlTag.classList.add('home-page');
    }

    ngOnDestroy() {

        // remove the the body classes
        this.bodyTag.classList.remove('home-page');
        this.htmlTag.classList.remove('home-page');

    }

}
