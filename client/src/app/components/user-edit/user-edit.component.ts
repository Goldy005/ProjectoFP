import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';
import { ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
    selector:'user-edit',
    templateUrl: './user-edit.component.html',
    providers: [UserService, UploadService]
})

export class UserEditComponent implements OnInit{

    public title: string;
    public user: User;
    public identity;
    public token;
    public status:string;
    public filesToUpload: Array<File>;
    public url:String;
    public imageChangedEvent: any = '';
    public croppedImage: any = '';
    

    // Search the tags in the DOM
    bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
    htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
    ){
        this.title = 'Actualizar mis datos';
        this.user = this._userService.getIdentity();
        this.identity = this.user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {

        console.log('user-edit.component se ha cargado!.');
        this.bodyTag.classList.add('home-page');
        this.htmlTag.classList.add('home-page');
        //document.getElementById('cropped-image').style.display = "none";

    }

    onSubmit(){

        this._userService.updateUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.status = 'error';
                }else{
                    this.status = 'success';
                    localStorage.setItem('identity',JSON.stringify(this.user));
                    this.identity = this.user;

                    //Subida de imagen de usuario
                    this._uploadService.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[],this.filesToUpload,this.token,'image')
                                        .then((result:any)=>{
                                            this.user.image = result.user.image;
                                            localStorage.setItem('identity',JSON.stringify(this.user));
                                        });
                }
            },
            error =>{
                let errorMensaje = <any>error;
                console.log(errorMensaje);
                if(errorMensaje != null){
                    this.status = 'error';
                }
            }
        );
    }

    //Metodo que convierte la imagen base64 a archivo para luego mandarselo al backend.
    fileSaved(){
        
        //document.getElementById('preview').style.display = "none";
        const base64 = this.croppedImage;

        function dataURLtoFile(dataurl, filename) {
 
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), 
                n = bstr.length, 
                u8arr = new Uint8Array(n);
                
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            
            return new File([u8arr], filename, {type:mime});
        }
        
        let file = dataURLtoFile(base64,'hello.png');
        let files: Array<File> = [file];
        this.filesToUpload = files;

        //document.getElementById('cropped-image').style.display = "block";
    }

    /*fileChangeEvent(fileInput:any){

    this.filesToUpload = <Array<File>>fileInput.target.files;
    
    }*/


    ngOnDestroy() {

        // remove the the body classes
        this.bodyTag.classList.remove('home-page');
        this.htmlTag.classList.remove('home-page');

    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        //document.getElementById('preview').style.display = "none";
        this.croppedImage = event.base64;
        console.log(this.croppedImage);
    }


}