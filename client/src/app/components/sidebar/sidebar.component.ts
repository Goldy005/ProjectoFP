import { Component, OnInit,Input,EventEmitter,Output  } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';

@Component({
    selector:'sidebar',
    templateUrl:'./sidebar.component.html',
    providers:[UserService,FollowService,PublicationService,UploadService]
})

export class SidebarComponent  implements OnInit{

    public identity: any;
    public token: any;
    @Input() stats:any;
    public url: string;
    public publication:Publication;
    public status:string;
    public filesToUpload:Array<File>;

    //Output
    @Output() sended = new EventEmitter();


    constructor(
        private _userService: UserService,
        private _publicationService: PublicationService,
        private _uploadService: UploadService

    ){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.publication = new Publication("","","","",this.identity._id);
    }

    ngOnInit(){
        console.log('se ha cargado el sidebar.');
    }

    onSubmit(form:any){
        this._publicationService.addPublication(this.token,this.publication).subscribe(
            response =>{
                if(response.publication){
                    this.publication = response.publication;                    
                    //subir la imagen.
                    this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+this.publication._id,[],this.filesToUpload,this.token,'image')
                                                        .then((result:any)=>{
                                                            this.publication.file = result.image;
                                                            this.status = 'success';
                                                            form.reset();
                                                        });
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

    //Cargar los ficheros en la variable
    fileChangeEvent(fileInput:any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    sendPublication(event: any){
        this.sended.emit({send:'true'});
    }
}