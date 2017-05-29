import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {FirebaseAuthService} from "./auth/services/firebase.auth.service";
import {HomeModule} from "./home/home.module";
import {AUTH_SERVICE} from "./auth/services/auth.service";
import {FIREBASE_AUTH, firebaseAuthFactory} from "./auth/services/firebase.auth.provider";
import {AuthModule} from "./auth/auth.module";
import {GlobalErrorHandler} from "./services/global.error.handler";

@NgModule({
    imports: [
        BrowserModule,
        AuthModule,
        HomeModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [
        { provide: FIREBASE_AUTH, useFactory: firebaseAuthFactory },
        { provide: AUTH_SERVICE, useClass: FirebaseAuthService },
        { provide: ErrorHandler, useClass: GlobalErrorHandler }
    ]
})
export class AppModule{}
