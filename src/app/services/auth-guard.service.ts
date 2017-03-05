import {Injectable, Inject} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService, AUTH_SERVICE} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        @Inject(AUTH_SERVICE) private authService: AuthService,
        private router: Router) {}

    canActivate() {
        let isUserLoggedIn = this.authService.isUserLoggedIn();
        if (!isUserLoggedIn) {
            this.router.navigate(['/login']);
        }
        return isUserLoggedIn;
    };
}
