import { Component, OnInit,DoCheck  } from '@angular/core';
import { Router, ActivatedRoute,Params} from '@angular/router';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
import { NumberSymbol } from '@angular/common';


@Component({
    selector:'users',
    templateUrl:'./users.component.html',
    providers:[UserService,FollowService]
})

export class UsersComponent  implements OnInit{
    
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
    public stats:any;
    public totalUsers: number;


    // Search the tags in the DOM
    bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
    htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ){
        this.title = 'Users';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.stats = JSON.parse(this._userService.getStats());
        this.pages = 1;
        this.page = 1;
        this.totalUsers = 1;
    }

    ngOnInit(){
        console.log('cargado el component users');
        console.log('page'+this.page);
        this.bodyTag.classList.add('home-page');
        this.htmlTag.classList.add('home-page');
        this.actualPage();
        this.getCounters();
        console.log('pages'+this.pages);

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

            //devolver la lista de usuarios.
            this.page = page;
            this.getUsers(page);
        });
    }

    ngDoCheck(){
        this.stats = JSON.parse(this._userService.getStats());
    }

    getUsers(page: number){
        this._userService.getUsers(page).subscribe(
            response =>{
                if(!response.users){
                    this.status = 'error';
                }else{
                    
                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.follows = response.users_following;
                    this.totalUsers = this.users.length;

                    if(page > this.pages){
                        this._router.navigate(['/users/1']);
                    }
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

}
