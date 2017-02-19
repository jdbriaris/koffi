import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate() {

        return true;

        //return this.checkSignIn();
    }

    private checkSignIn(): boolean {

        if (this.authService.isLoggedIn) {
            return true;
        }

        this.router.navigate([('/login')]);
        return false;
    }
}
