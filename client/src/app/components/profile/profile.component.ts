import { Component, OnInit,DoCheck  } from '@angular/core';
import { Router, ActivatedRoute,Params} from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
import { PublicationService } from '../../services/publication.service';
import { Publication } from '../../models/publication';



@Component({
    selector:'profile',
    templateUrl: './profile.component.html',
    providers: [UserService,FollowService,PublicationService]
})

export class ProfileComponent implements OnInit{

    public title:string;
    public user:User;
    public status:string;
    public identity:any;
    public token:any;
    public stats:any;
    public url:any;
    public follow:any;
    public followed:any;
    public following:any;
    public followUserOver:any;
    public statsUser:any;
    public page:any;
    public total:any;
    public pages:any;
    public publications:Publication[];
    public itemsPerPage:any;
    public noMore = false;



    // Search the tags in the DOM
    bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
    htmlTag: HTMLElement = document.getElementsByTagName('html')[0];


    constructor(

        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService,
        private _publicationService: PublicationService

    ){
        this.title = 'Perfil';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.stats = JSON.parse(this._userService.getStats());
        this.followed = false;
        this.following = false;
        this.page = 1;
        this.user = null;
    }

    ngOnInit(){

        this.bodyTag.classList.add('home-page');
        this.htmlTag.classList.add('home-page');
        console.log('Profile component cargado corectamente.');
        this.loadPage();
    }

    ngOnDestroy() {
        
        // remove the the body classes
        this.bodyTag.classList.remove('home-page');
        this.htmlTag.classList.remove('home-page');

  }

    //Metodo para obtener el id de la url.
    loadPage(){
        this._route.params.subscribe(params =>{
            let id = params['id'];

            this.getUser(id);
            this.getCounters(id);
        });

    }

    //Conseguir la información del usuario pasando el id.

    getUser(id:any){

        this._userService.getUser(id).subscribe(
            response =>{
                if(!response.user){
                    this.status = 'error';
                }else{
                    this.user = response.user;
                }


                //Para ver si estoy siguiendo el usuario.
                if(response.following && response.following._id){
                    this.following = true; // yo lo estoy siguiendo
                }else{
                    this.following = false;
                }

                //Para ver si me está siguiendo

                if(response.followed && response.followed._id){
                    this.followed = true;
                }else{
                    this.followed = false;
                }

                //cargamos las publicaciones del usuario.
                this.getPublicationsUser(1);

            },
            error =>{
                let errorMessage = <any>error;
                console.log(errorMessage);
                this._router.navigate(['/profile',this.identity._id]);

                if(!errorMessage){
                    this.status = 'error';
                }
            }
        );
    }

    //metodo para obtener las estadisticas del usuario.
    getCounters(userid:any = null){

        this._userService.getCounters(userid).subscribe(
            
            response => {

                //obtener las estadisticas en el caso del usuario identificado.
                if(userid == null){
                    localStorage.setItem('stats',JSON.stringify(response));
                    this.status = 'success';
                    this.stats  = JSON.parse(this._userService.getStats());
                }else{
                    //obtener las estadisticas en el caso de otro usuario.
                    this.statsUser = response;
                }
            
            },
            error =>{
                console.log(<any>error);
            }
        );
    }

    

    //Al publicar una publicación refresca las estadisticas.
    refresh(event:any){
        this.getCounters();
    }


    //metodo para seguir un usuario

    followUser(followed: any){
        
        let follow = new Follow('',this.identity._id,followed);

        this._followService.addFollow(this.token,follow).subscribe(

            response =>{
                if(!response.follow){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    this.following = true;
                    this.getCounters();//actualiza las estadisticas del usuario identicado.
                    this.getCounters(this.user._id); //actualiza las estadisticas de otros usuarios.
                }
            },
            error =>{
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.status = 'error';
                }
            }
        );

    }

    //metodo para dejar de seguir

    unfollowUser(followed:any){

        this._followService.deleteFollow(this.token,followed).subscribe(
            
            response =>{
                
                this.following = false;
                this.getCounters();//actualiza las estadisticas del usuario identicado.
                this.getCounters(this.user._id); //actualiza las estadisticas de otros usuarios.
            },
            error =>{
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(errorMessage != null){
                    this.status = 'error';
                }
            }

        );
    }

    mouseEnter(user_id:any){
        this.followUserOver = user_id;
    }

    mouseLeave(user_id:any){
        this.followUserOver = 0;
    }

    //Método para obtener las publicaciones.
    getPublicationsUser(page:any,adding = false,refreshSidebar = false){
        

        this._publicationService.getPublicationsUser(this.token,this.user._id,page).subscribe(
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
                    }else{
                        this.noMore = false;
                    }

                    //Actualizamos las estadisticas.
                    if(refreshSidebar){
                        this.getCounters();
                    }

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
        this.getPublicationsUser(this.page,true);

    }


}