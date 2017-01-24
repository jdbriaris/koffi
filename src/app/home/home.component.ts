import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    moduleId: 'module.id',
    templateUrl: './home.component.html'
})
export class HomeComponent{

    constructor(private router: Router) {}

    wod(): void {
        this.router.navigate([('home/workouts')]);
    };

    dashboard(): void {
        this.router.navigate([('home/dashboard')]);
    };

    exercises(): void {
        this.router.navigate([('home/exercises')]);
    };
}
