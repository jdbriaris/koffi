import {NgModule} from '@angular/core';
import {HomeComponent} from "./home.component";
import {HomeGuard} from "./home.guard";
import {HomeRoutingModule} from "./home-routing.module";

@NgModule({
    imports: [HomeRoutingModule],
    declarations: [HomeComponent],
    providers: [HomeGuard]
})
export class HomeModule{}