import {NgModule} from '@angular/core';
import {HomeRoutingModule} from "./home-routing.module";
import {HomeComponent} from "./home.component";
import {AuthGuard} from "../services/auth-guard.service";
import {DashboardModule} from "./dashboard/dashboard.module";
import {WorkoutsModule} from "./workouts/workouts.module";
import {ExercisesModule} from "./exercises/exercises.module";

@NgModule({
    imports: [
        WorkoutsModule,
        ExercisesModule,
        DashboardModule,
        HomeRoutingModule
    ],
    declarations: [HomeComponent],
    providers: [AuthGuard]
})
export class HomeModule{}
