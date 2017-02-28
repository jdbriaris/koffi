import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {FirebaseService} from "./services/firebase.service";
import {LoginModule} from "./login/login.module";
import {RegisterModule} from "./register/register.module";
import {FirebaseAuthService} from "./services/firebase.auth.service";
import {RegisterReviewModule} from "./register-review/register-review.module";
import {HomeModule} from "./home/home.module";
import {AUTH_SERVICE} from "./services/auth.service";

@NgModule({
    imports: [
        BrowserModule,
        LoginModule,
        RegisterModule,
        RegisterReviewModule,
        HomeModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        FirebaseService,
        { provide: AUTH_SERVICE, useClass: FirebaseAuthService }
    ]
})
export class AppModule{}
