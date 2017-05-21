import {TestBed, async} from "@angular/core/testing";
import {RouterStub} from "../testing/router.stub";
import {Router} from "@angular/router";
import {AUTH_SERVICE, AuthService} from "../auth/services/auth.service";
import {HomeGuard} from "./home.guard";
import Spy = jasmine.Spy;
import createSpyObj = jasmine.createSpyObj;
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {User} from "../auth/user";


class TestFixture {
    mockAuthService: AuthService;
    mockRouter: Router;
    private logInStateChangedBehavior: BehaviorSubject<User>;

    constructor(){
        this.mockAuthService = this.createMockAuthService();
        this.mockRouter = this.createMockRouter();
    }

    public onUserLogInStateChangedReturns(user: User) {
        this.logInStateChangedBehavior.next(user);
    }

    private createMockAuthService(): AuthService {
        this.logInStateChangedBehavior = new BehaviorSubject(null);

        let authService = createSpyObj<AuthService>('mockAuthService', ['onUserLogInStateChanged']);

        (authService.onUserLogInStateChanged as Spy).and
            .callFake(() => { return this.logInStateChangedBehavior.asObservable(); });

        return authService;
    }

    private createMockRouter(): Router {
        return createSpyObj<Router>('mockRouter', ['navigate']);
    }
}

describe('HomeGuard', () => {
    let router: Router;
    let authService: AuthService;
    let authGuard: HomeGuard;
    let testFixture: TestFixture;

    beforeEach(() => {
        testFixture = new TestFixture();
        TestBed.configureTestingModule({
            providers: [
                {provide: AUTH_SERVICE, useValue: testFixture.mockAuthService},
                {provide: Router, useValue: testFixture.mockRouter}
            ]
        });
        router = TestBed.get(Router);
        authService = TestBed.get(AUTH_SERVICE);
        authGuard = new HomeGuard(authService, router);
    });

    it('on canActivate with user logged in return true', () => {
        testFixture.onUserLogInStateChangedReturns({name: "name",  email: "password", uid: "uid"});
        authGuard.canActivate().subscribe((activate: boolean) => {
            expect(authService.onUserLogInStateChanged).toHaveBeenCalledTimes(1);
            expect(activate).toBeTruthy();
        });
    });

    it('on canActivate with user not logged in returns false', () => {
        authGuard.canActivate().subscribe((activate: boolean) => {
            expect(authService.onUserLogInStateChanged).toHaveBeenCalledTimes(1);
            expect(activate).toBeFalsy();
        });
    });

    it('on canActivate with user not logged navigates to auth', () => {
        authGuard.canActivate().subscribe(() => {
            expect(router.navigate).toHaveBeenCalledWith(['auth']);
        });
    });

});