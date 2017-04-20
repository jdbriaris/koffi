import {NgModule} from '@angular/core';
import {ForgotPasswordComponent} from "./forgot-password.component";
import {ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule{}
