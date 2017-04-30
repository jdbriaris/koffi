import {Component, Inject} from '@angular/core';
import {AUTH_SERVICE, AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
    moduleId: 'module.id',
    templateUrl: 'home.component.html'
})
export class HomeComponent{

    constructor(
        @Inject(AUTH_SERVICE) private authService: AuthService,
        private router: Router
    ){}

    signOut(): void {
        this.authService.logOut().subscribe(() => {
           this.router.navigate(['']);
        });
    }
}
