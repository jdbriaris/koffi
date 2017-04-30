import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AppComponent} from "./app.component";
import {AUTH_SERVICE, User} from "./services/auth.service";
import {AuthServiceStub} from "./testing/auth.service.stub";
import {Router} from "@angular/router";
import {RouterStub} from "./testing/router.stub";
import {RouterTestingModule} from "@angular/router/testing";
import Spy = jasmine.Spy;

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let authService: AuthServiceStub;
    let routerStub: RouterStub;
    let routerSpy: Spy;
    let user: User;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppComponent],
            providers: [
                {provide: AUTH_SERVICE, useClass: AuthServiceStub},
                {provide: Router, useClass: RouterStub}
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        authService = fixture.debugElement.injector.get(AUTH_SERVICE);
        routerStub = fixture.debugElement.injector.get(Router);
        routerSpy = spyOn(routerStub, 'navigate').and.callThrough();
    });

    it('should navigate to home if user already logged in (i.e. user not null)', () => {
        user = {name: "name",  email: "password", uid: "uid"};
        authService.setUserLogInStateChangedResult(user);

        component = fixture.componentInstance;

        expect(routerSpy).toHaveBeenCalledTimes(1);
        expect(routerSpy).toHaveBeenCalledWith(['/home']);
    });

    it('should navigate to log in if user not logged in (i.e. user null)', () => {
        authService.setUserLogInStateChangedResult(null);

        component = fixture.componentInstance;

        expect(routerSpy).toHaveBeenCalledTimes(1);
        expect(routerSpy).toHaveBeenCalledWith(['/login']);
    });
});
