import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home.component";
import {AuthGuard} from "../services/auth-guard.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {WorkoutsComponent} from "./workouts/workouts.component";
import {ExercisesComponent} from "./exercises/exercises.component";

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', redirectTo: '/home/workouts', pathMatch: 'full'},
            {path: 'workouts', component: WorkoutsComponent},
            {path: 'exercises', component: ExercisesComponent},
            {path: 'dashboard', component: DashboardComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule{}
