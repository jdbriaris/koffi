import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {LoginModule} from "./login/login.module";
import {RegisterModule} from "./register/register.module";
import {FirebaseService} from "./services/firebase.service";
import {RegisterReviewModule} from "./register-review/register-review.module";
import {HomeModule} from "./home/home.module";
import {AUTH_SERVICE} from "./services/auth.service";
import {FIREBASE_AUTH, firebaseAppFactory} from "./services/firebase.app.provider";
import {ForgotPasswordModule} from "./forgot-password/forgot-password.module";


@NgModule({
    imports: [
        BrowserModule,
        LoginModule,
        RegisterModule,
        RegisterReviewModule,
        ForgotPasswordModule,
        HomeModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        { provide: FIREBASE_AUTH, useFactory: firebaseAppFactory },
        { provide: AUTH_SERVICE, useClass: FirebaseService }
    ]
})
export class AppModule{}
