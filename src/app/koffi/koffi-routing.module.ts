import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {KoffiComponent} from "./koffi.component";
import {AuthGuard} from "../services/auth-guard.service";

const routes: Routes = [
    {
        path: 'koffi',
        component: KoffiComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KoffiRoutingModule{}