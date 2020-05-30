import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { PublicationService } from 'src/app/services/publication.service';
//import { $ } from 'protractor';
import * as $ from 'jquery'; //importar jquery


@Component({
    selector:'timeline',
    templateUrl: './timeline.component.html',
    providers: [UserService,PublicationService]
})

export class TimelineComponent implements OnInit{

    public identity: any;
    public token: any;
    public title:string;
    public url:string;
    public stats:any;
    public status:string;
    public page:any;
    public total:any;
    public pages:any;
    public publications:Publication[];
    public itemsPerPage:any;
    public noMore = false;
    public showImage:any;

    // Search the tags in the DOM
    bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
    htmlTag: HTMLElement = document.getElementsByTagName('html')[0];
    

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _publicationService: PublicationService
    ){
        this.title = 'Timeline';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.stats = JSON.parse(this._userService.getStats());
        this.page = 1;
    }

    ngOnInit(){

        console.log('Timeline componente cargado correctamente.');
        this.bodyTag.classList.add('home-page');
        this.htmlTag.classList.add('home-page');
        this.getPublications(this.page);
        this.getCounters();


    }

    ngOnDestroy() {

        // remove the the body classes
        this.bodyTag.classList.remove('home-page');
        this.htmlTag.classList.remove('home-page');

    }
    
    //Método para obtener las publicaciones.
    getPublications(page:any,adding = false,refreshSidebar = false){
        this._publicationService.getPublications(this.token,page).subscribe(
            response =>{


                if(response.publications){

                    this.stats = JSON.parse(this._userService.getStats());
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.status = 'success';
                    this.itemsPerPage = response.items_per_page;
                    
                    if(!adding){
                        this.publications = response.publications;
                    }else{
                        let arrayA = this.publications;
                        let arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);
                        $("html,body").animate({ scrollTop: $('body').prop("scrollHeight")},1600);
                    }
                    //Si el número de las publicaciones totales es igual número de publicaciones que hay en la página
                    //no se mostrará el botón ver más.
                    if(this.publications.length == this.total ){
                        this.noMore =  true;
                    }            
                    if(page > this.pages){
                        //this._router.navigate(['/home']);
                    }

                    //Actualizamos las estadisticas.
                    if(refreshSidebar){
                        this.getCounters();
                    }

                    console.log(this.publications);
                }else{
                    this.status = 'error';
                }
            },
            error => {
                let errorMessage = <any>error;
                console.log(error);

                if(errorMessage != null){
                    this.status = 'error';
                }

            }
        );
    }
    
    //metodo para ver más, publicaciones.
    viewMore(){
        this.page += 1;
        if(this.pages == this.page ){
            this.noMore =  true;
        }
        this.getPublications(this.page,true);

    }

    //Al publicar una publicación refresca el component y las estadisticas del contandor.
    refresh(event=null){
        this.getPublications(1,false,true);
    }

    //metodo para obtener las estadisticas del usuario.
    getCounters(){

        this._userService.getCounters().subscribe(
            
            response => {
                localStorage.setItem('stats',JSON.stringify(response));
                this.status = 'success';
                this.stats  = JSON.parse(this._userService.getStats());
            
            },
            error =>{
                console.log(<any>error);
            }
        );
    }

    //Muestra la imagen si hay y a la vez lo oculta.
    showThisImage(id:any){
        this.showImage = id;
    }

    //borrar la publicación.
    deletePublication(id:any){

        console.log('borrar publicaion'+id);
        this._publicationService.deletePublication(this.token,id).subscribe(
            response => {
                this.refresh();
            },
            error =>{
                console.log(<any>error);
            }
        );
    }
}
