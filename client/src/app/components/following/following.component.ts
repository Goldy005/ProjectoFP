import { Component, OnInit,DoCheck  } from '@angular/core';
import { Router, ActivatedRoute,Params} from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';


@Component({
    selector:'following',
    templateUrl:'./following.component.html',
    providers:[UserService,FollowService]
})

export class FollowingComponent  implements OnInit{
    
    public title:string;
    public identity: { _id: string; };
    public token: any;
    public page: string | number;
    public next_page: number;
    public prev_page: number;
    public status:string;
    public total: any;
    public pages: number;
    public users: User[];
    public url:String;
    public follows: any; // gente que sige el usuarios.
    public followUserOver: number;
    public following:[];
    public stats:any;
    public userPageId:string;
    public user:User;


    // Search the tags in the DOM
    bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
    htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ){
        this.title = 'Usuario seguidos por ';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.stats = JSON.parse(this._userService.getStats());
        this.following = null;
    }

    ngOnInit(){
        this.bodyTag.classList.add('home-page');
        this.htmlTag.classList.add('home-page');
        this.actualPage();
        this.getCounters();

    }

    actualPage(){

        this._route.params.subscribe(params =>{
            
            let page = +params['page'];
            let userId = params['id'];
            this.page = page;
            this.userPageId = userId;
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

            //devolver la lista de usuarios.
            this.getUser(userId,page);
        });
    }

    ngDoCheck(){
        this.stats = JSON.parse(this._userService.getStats());
    }

    //Metodo para ver los usuarios que sigo.
    getFollows(userId:string,page: number){
        this._followService.getFollowing(this.token,userId,page).subscribe(
            response =>{
                if(!response.follows){
                    this.status = 'error';
                }else{
                    this.total = response.total;
                    this.following = response.follows;
                    this.pages = response.pages;
                    this.follows = response.users_following;
                }
            },
            error =>{
                let errorMessage = <any>error;
                console.log(errorMessage);

                if(!errorMessage){
                    this.status = 'error';
                }
            }
        );
    }

    ngOnDestroy() {
        // remove the the body classes
        this.bodyTag.classList.remove('home-page');
        this.htmlTag.classList.remove('home-page');
    }

    mouseEnter(userId: any){
        this.followUserOver = userId;
    }

    mouseLeave(userId: any){
        this.followUserOver = 0;
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
                    this.follows.push(followed);
                    this.getCounters();
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
                
                let search = this.follows.indexOf(followed);
                
                if(search != -1 ){
                    this.follows.splice(search,1);
                }
                this.getCounters();
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

    //Al publicar una publicación refresca las estadisticas.
    refresh(event:any){
        this.getCounters();
    }

    //Método para obtener información de un usuario.
    getUser(id:any,page:number){
        this._userService.getUser(id).subscribe(
            response =>{
                if(response.user){
                    this.user = response.user;
                    this.getFollows(id,page);
                }else{
                    this._router.navigate(['/home']);
                }
            },
            error =>{
                console.log(<any>error);
            }
        );
    }

}
