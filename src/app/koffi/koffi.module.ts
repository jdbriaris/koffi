import {NgModule} from '@angular/core';
import {KoffiComponent} from "./koffi.component";
import {AuthGuard} from "../services/auth-guard.service";
import {KoffiRoutingModule} from "./koffi-routing.module";

@NgModule({
    imports: [KoffiRoutingModule],
    declarations: [KoffiComponent],
    providers: [AuthGuard]
})
export class KoffiModule{}