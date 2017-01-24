import {NgModule} from "@angular/core";
import {CommonModule} from '@angular/common';
import {SignUpComponent} from "./sign-up.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    declarations: [SignUpComponent]
})
export class SignUpModule{}