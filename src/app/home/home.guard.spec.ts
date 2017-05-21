import {TestBed, async} from "@angular/core/testing";
import {RouterStub} from "../testing/router.stub";
import {Router} from "@angular/router";
import {AuthServiceStub} from "../testing/auth.service.stub";
import {AUTH_SERVICE, AuthService} from "../auth/services/auth.service";
import {HomeGuard} from "./home.guard";
import Spy = jasmine.Spy;

describe('HomeGuard', () => {
    let router: Router;
    let authService: AuthService;
    let authGuard: HomeGuard;
    let authServiceSpy: Spy;


    //TODO
    // beforeEach(() => {
    //     TestBed.configureTestingModule({
    //         providers: [
    //             {provide: AUTH_SERVICE, useClass: AuthServiceStub},
    //             {provide: Router, useClass: RouterStub}
    //         ]
    //     });
    //     router = TestBed.get(Router);
    //     authService = TestBed.get(AUTH_SERVICE);
    //     authGuard = new HomeGuard(authService, router);
    //     authServiceSpy = spyOn(authService, 'isUserLoggedIn');
    // });
    //
    // it('on canActivate returns false if user not logged in', () => {
    //     authServiceSpy.and.returnValue(false);
    //     authGuard.canActivate();
    //     expect(authGuard.canActivate()).toBeFalsy();
    // });
    //
    // it('on canActivate navigates to login if user not logged in', () => {
    //     let routerSpy = spyOn(router, 'navigate');
    //     authServiceSpy.and.returnValue(false);
    //     authGuard.canActivate();
    //     expect(routerSpy).toHaveBeenCalledTimes(1);
    //     expect(routerSpy).toHaveBeenCalledWith(['/auth']);
    // });
    //
    // it('on canActivate returns true if user logged in', () => {
    //     authServiceSpy.and.returnValue(true);
    //     authGuard.canActivate();
    //     expect(authGuard.canActivate()).toBeTruthy();
    // });
});