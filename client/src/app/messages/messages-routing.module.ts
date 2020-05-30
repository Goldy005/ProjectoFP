import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

//components
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';

//Services
import { UserGuard } from '../services/user.guard';// Los guards en Angular se usan para restringuir el acceso a rutas desde fuera( si el usuario no está logueado.). 

const messagesRoutes:Routes = [
    {
        path:'messages',
        component:MainComponent,
        children:[
            {path:'',redirectTo:'received',pathMatch:'full',canActivate:[UserGuard]},
            {path: 'send',component:AddComponent,canActivate:[UserGuard]},
            {path: 'received',component:ReceivedComponent,canActivate:[UserGuard]},
            {path: 'received/:page',component:ReceivedComponent,canActivate:[UserGuard]},
            {path: 'sended',component:SendedComponent,canActivate:[UserGuard]},
            {path: 'sended/:page',component:SendedComponent,canActivate:[UserGuard]}
        ]
    }
];

@NgModule({
    imports:[
        RouterModule.forChild(messagesRoutes)
    ],
    exports:[
        RouterModule
    ]
})
export class MessagesRoutingModule{}