import { Injectable }     from '@angular/core';
import { Router, CanActivate }    from '@angular/router';
import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate() {
        return this.checkSignIn();
    }

    private checkSignIn(): boolean {

        if (this.authService.isSignedIn) {
            return true;
        }

        this.router.navigate([('/sign-in')]);
        return false;
    }
}
