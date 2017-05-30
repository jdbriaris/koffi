import {Router} from "@angular/router";
import {AuthService} from "../auth/services/auth.service";
import {HomeGuard} from "./home.guard";
import Spy = jasmine.Spy;
import createSpyObj = jasmine.createSpyObj;
import {MockUser} from "../auth/testing/mock.user";
import * as TypeMoq from 'typemoq';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {User} from "../auth/user";

describe('HomeGuard', () => {
    let mockRouter: TypeMoq.IMock<Router>;
    let mockAuthService: TypeMoq.IMock<AuthService>;
    let behavior: BehaviorSubject<User>;
    let authGuard: HomeGuard;

    beforeEach(() => {
        mockAuthService = TypeMoq.Mock.ofType<AuthService>();
        mockRouter = TypeMoq.Mock.ofType<Router>();
        behavior = new BehaviorSubject<User>(null);
        authGuard = new HomeGuard(mockAuthService.object, mockRouter.object);
    });

    it('on canActivate with user logged in return true', (done) => {
        behavior.next(MockUser);
        mockAuthService.setup(x => x.onUserLogInStateChanged()).returns(() => behavior.asObservable());

        authGuard.canActivate().subscribe((activate: boolean) => {
           mockAuthService.verify(auth => auth.onUserLogInStateChanged(), TypeMoq.Times.once());
           expect(activate).toBeTruthy();
           done();
        });
    });

    it('on canActivate with user not logged in returns false', (done) => {
        behavior.next(null);
        mockAuthService.setup(x => x.onUserLogInStateChanged()).returns(() => behavior.asObservable());

        authGuard.canActivate().subscribe((activate: boolean) => {
            mockAuthService.verify(auth => auth.onUserLogInStateChanged(), TypeMoq.Times.once());
            expect(activate).toBeFalsy();
            done();
        })
    });

    it('on canActivate with user not logged navigates to auth', (done) => {
        behavior.next(null);
        mockAuthService.setup(x => x.onUserLogInStateChanged()).returns(() => behavior.asObservable());

        authGuard.canActivate().subscribe(() => {
            mockRouter.verify(router => router.navigate(['auth']), TypeMoq.Times.once());
            done();
        });
    });
});