import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {FirebaseService} from "./services/firebase.service";
import {SignInModule} from "./sign-in/sign-in.module";
import {SignUpModule} from "./sign-up/sign-up.module";
import {HomeModule} from "./home/home.module";
import {AuthService} from "./services/auth.service";
import {SignUpReviewModule} from "./sign-up-review/sign-up-review.module";

@NgModule({
    imports: [
        BrowserModule,
        SignInModule,
        SignUpModule,
        SignUpReviewModule,
        HomeModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [AuthService,FirebaseService]
})
export class AppModule{}
