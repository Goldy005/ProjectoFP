//Modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';//para las fechas.

//Rutas
import { MessagesRoutingModule } from './messages-routing.module';
//Componentes
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';

//Services
import { UserService } from '../services/user.service';
import { UserGuard } from '../services/user.guard';// Los guards en Angular se usan para restringuir el acceso a rutas desde fuera( si el usuario no está logueado.). 

@NgModule({
    declarations:[
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SendedComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        MessagesRoutingModule,
        MomentModule,
    ],
    exports:[
        MainComponent,
        AddComponent,
        SendedComponent,
        ReceivedComponent
    ],
    providers:[UserService,UserGuard]
})

export class MessagesModule{}