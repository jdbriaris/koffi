import {Injectable, Inject} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService, AUTH_SERVICE} from "../auth/services/auth.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class HomeGuard implements CanActivate {

    constructor(
        @Inject(AUTH_SERVICE) private authService: AuthService,
        private router: Router) {}

    canActivate() : Observable<boolean> {
        return this.authService.onUserLogInStateChanged().map((user) => {
            if (user) {
                return true;
            }
            else {
                this.router.navigate(['auth']);
                return false;
            }
        })
    };
}
