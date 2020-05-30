/*Dependiendo de la ruta te saca un component o otro. */
import { ModuleWithProviders } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

//Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent} from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';
import { UserGuard } from './services/user.guard';// Los guards en Angular se usan para restringuir el acceso a rutas desde fuera( si el usuario no está logueado.). 

const appRoutes: Routes = [

    {path:'',component:LoginComponent},
    {path:'home',component:HomeComponent,canActivate:[UserGuard]},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'mis-datos',component: UserEditComponent,canActivate:[UserGuard]},
    {path:'users/:page',component: UsersComponent,canActivate:[UserGuard]},
    {path:'users',component: UsersComponent,canActivate:[UserGuard]},
    {path:'timeline',component: TimelineComponent,canActivate:[UserGuard]},
    {path:'profile/:id',component: ProfileComponent,canActivate:[UserGuard]},
    {path:'following/:id/:page',component: FollowingComponent,canActivate:[UserGuard] },
    {path:'followed/:id/:page',component:FollowedComponent,canActivate:[UserGuard]},
    {path:'**',component:HomeComponent} //la ruta 404 nos cargará el component home.
    
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);