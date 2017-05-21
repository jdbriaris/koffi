import {NgModule} from "@angular/core";
import {LoginModule} from "./login/login.module";
import {RegisterModule} from "./register/register.module";
import {RegisterReviewModule} from "./register-review/register-review.module";
import {ForgotPasswordModule} from "./forgot-password/forgot-password.module";
import {AuthComponent} from "./auth.component";
import {AuthRoutingModule} from "./auth-routing.module";

@NgModule({
    imports: [
        AuthRoutingModule,
        LoginModule,
        RegisterModule,
        RegisterReviewModule,
        ForgotPasswordModule
    ],
    declarations: [AuthComponent]
})
export class AuthModule{}