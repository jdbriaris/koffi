import {TestBed} from "@angular/core/testing";
import {Router} from "@angular/router";
import {AUTH_SERVICE} from "../auth/services/auth.service";
import {HomeGuard} from "./home.guard";
import Spy = jasmine.Spy;
import createSpyObj = jasmine.createSpyObj;
import {MockUser} from "../auth/testing/mock.user";
import {MockRouter} from "../testing/mock.router";
import {MockAuthService} from "../auth/testing/mock.auth.service";

describe('HomeGuard', () => {
    let router: Router;
    let authService: MockAuthService;
    let authGuard: HomeGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: AUTH_SERVICE, useClass: MockAuthService},
                {provide: Router, useClass: MockRouter}
            ]
        });
        router = TestBed.get(Router);
        authService = TestBed.get(AUTH_SERVICE);
        authGuard = new HomeGuard(authService, router);
    });

    it('on canActivate with user logged in return true', () => {
        authService.setUserLogInStateChangedBehavior(MockUser);
        spyOn(authService, 'onUserLogInStateChanged').and.callThrough();
        authGuard.canActivate().subscribe((activate: boolean) => {
            expect(authService.onUserLogInStateChanged).toHaveBeenCalledTimes(1);
            expect(activate).toBeTruthy();
        });
    });

    it('on canActivate with user not logged in returns false', () => {
        authService.setUserLogInStateChangedBehavior(null);
        spyOn(authService, 'onUserLogInStateChanged').and.callThrough();
        authGuard.canActivate().subscribe((activate: boolean) => {
            expect(authService.onUserLogInStateChanged).toHaveBeenCalledTimes(1);
            expect(activate).toBeFalsy();
        });
    });

    it('on canActivate with user not logged navigates to auth', () => {
        authService.setUserLogInStateChangedBehavior(null);
        spyOn(router, 'navigate');
        authGuard.canActivate().subscribe(() => {
            expect(router.navigate).toHaveBeenCalledWith(['auth']);
        });
    });
});