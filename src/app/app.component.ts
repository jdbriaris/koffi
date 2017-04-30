import {Component, Inject} from '@angular/core';
import './styles/styles.scss';
import {AUTH_SERVICE, AuthService, User} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
    moduleId: 'module.id',
    selector: 'xfit-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(
        private router: Router,
        @Inject(AUTH_SERVICE) private authService: AuthService
    ){
        authService.onUserLogInStateChanged().subscribe((user: User) => {
            if (user) {
                this.router.navigate(['/home']);
            }
            else {
                this.router.navigate(['/login']);
            }
        })
    }
}