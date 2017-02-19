import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {SignInComponent} from "./login.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [SignInComponent]
})
export class SignInModule{}

