import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {FirebaseService} from "./services/firebase.service";
import {SignInModule} from "./sign-in/sign-in.module";
import {RegisterModule} from "./register/register.module";
import {AuthService} from "./services/auth.service";
import {SignUpReviewModule} from "./sign-up-review/sign-up-review.module";
import {KoffiModule} from "./koffi/koffi.module";

@NgModule({
    imports: [
        BrowserModule,
        SignInModule,
        RegisterModule,
        SignUpReviewModule,
        KoffiModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [AuthService,FirebaseService]
})
export class AppModule{}
