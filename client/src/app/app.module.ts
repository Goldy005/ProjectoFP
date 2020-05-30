import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';// para hacer peticiones HTTP y hacer peticiones a servicios REST(AJAX)
import { MomentModule } from 'angular2-moment';//para las fechas.
import { ImageCropperModule } from 'ngx-image-cropper';

// Modulo custom
import { MessagesModule } from './messages/messages.module';

//Importar componentes

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';

//Services
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';// Los guards en Angular se usan para restringuir el acceso a rutas desde fuera( si el usuario no está logueado.). 

//Para poder usar los components en cualquier sitio, los anados en delcaration,
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    ProfileComponent,
    FollowingComponent,
    FollowedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    FormsModule,
    HttpClientModule,
    MomentModule,
    ImageCropperModule,
    MessagesModule
    ],
  providers: [appRoutingProviders,UserService,UserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
