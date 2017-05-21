import {TestBed, async} from "@angular/core/testing";
import {RouterStub} from "../testing/router.stub";
import {Router} from "@angular/router";
import {AuthServiceStub} from "../testing/auth.service.stub";
import {AUTH_SERVICE, AuthService} from "./auth.service";
import {AuthGuard} from "./auth-guard.service";
import Spy = jasmine.Spy;

describe('AuthGuard', () => {
    let router: Router;
    let authService: AuthService;
    let authGuard: AuthGuard;
    let authServiceSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: AUTH_SERVICE, useClass: AuthServiceStub},
                {provide: Router, useClass: RouterStub}
            ]
        });
        router = TestBed.get(Router);
        authService = TestBed.get(AUTH_SERVICE);
        authGuard = new AuthGuard(authService, router);
        authServiceSpy = spyOn(authService, 'isUserLoggedIn');
    });

    it('on canActivate returns false if user not logged in', () => {
        authServiceSpy.and.returnValue(false);
        authGuard.canActivate();
        expect(authGuard.canActivate()).toBeFalsy();
    });

    it('on canActivate navigates to login if user not logged in', () => {
        let routerSpy = spyOn(router, 'navigate');
        authServiceSpy.and.returnValue(false);
        authGuard.canActivate();
        expect(routerSpy).toHaveBeenCalledTimes(1);
        expect(routerSpy).toHaveBeenCalledWith(['/auth']);
    });

    it('on canActivate returns true if user logged in', () => {
        authServiceSpy.and.returnValue(true);
        authGuard.canActivate();
        expect(authGuard.canActivate()).toBeTruthy();
    });
});