/*Dependiendo de la ruta te saca un component o otro. */
import { ModuleWithProviders } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

//Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent} from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';

const appRoutes: Routes = [

    {path:'',component:LoginComponent},
    {path:'home',component:HomeComponent},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'mis-datos',component: UserEditComponent},
    {path:'users/:page',component: UsersComponent},
    {path:'users',component: UsersComponent},
    {path:'**',component:HomeComponent} //la ruta 404 nos cargará el component home.
    
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);