import {NgModule} from '@angular/core';
import {HomeComponent} from "./home.component";
import {AuthGuard} from "../services/auth-guard.service";
import {HomeRoutingModule} from "./home-routing.module";

@NgModule({
    imports: [HomeRoutingModule],
    declarations: [HomeComponent],
    providers: [AuthGuard]
})
export class HomeModule{}