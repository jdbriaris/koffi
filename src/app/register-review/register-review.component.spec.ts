import {async, TestBed, ComponentFixture} from "@angular/core/testing";
import {RegisterReviewComponent} from "./register-review.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ActivatedRouteStub, RouterStub} from "../testing/router.stub";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import Spy = jasmine.Spy;

class RegisterReviewPage {
    private registerMessage: HTMLElement;
    loginButton: DebugElement;
    registerButton: DebugElement;
    forgotPasswordButton: DebugElement;

    constructor(private fixture: ComponentFixture<RegisterReviewComponent>){
        this.queryDomElements(fixture);
    }

    private queryDomElements(fixture: ComponentFixture<RegisterReviewComponent>){
        this.registerMessage = fixture.debugElement.query(By.css('span')).nativeElement;
        this.loginButton = fixture.debugElement.query(By.css('#login-button'));
        this.registerButton = fixture.debugElement.query(By.css('#register-button'));
        this.forgotPasswordButton = fixture.debugElement.query(By.css('#forgot-password'));
    }

    getRegisterMessage(): string {
        return this.registerMessage.textContent;
    }

    usePressesLogIn(): RegisterReviewPage {
        this.loginButton.triggerEventHandler('click', null);
        return this;
    }

    usePressesRegister(): RegisterReviewPage {
        this.registerButton.triggerEventHandler('click', null);
        return this;
    }

    usePressesForgotPassword(): RegisterReviewPage {
        this.forgotPasswordButton.triggerEventHandler('click', null);
        return this;
    }

}

describe('RegisterReviewComponent', () => {
    const email = 'someone@somewhere.com';
    let component: RegisterReviewComponent;
    let fixture: ComponentFixture<RegisterReviewComponent>;
    let page: RegisterReviewPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterReviewComponent],
            providers: [
                {provide: ActivatedRoute, useClass: ActivatedRouteStub},
                {provide: Router, useClass: RouterStub}
            ]
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterReviewComponent);
        component = fixture.componentInstance;
        page = new RegisterReviewPage(fixture);
        let activateRoute = fixture.debugElement.injector.get(ActivatedRoute);
        activateRoute.testParams = { email: email};
        fixture.detectChanges(); // calls ngOnInit
    });

    it('displays correct message to user', () => {
        let expectedMsg = 'Looks like an account already exists with email ' + email;
        expect(page.getRegisterMessage()).toEqual(expectedMsg);
    });

    it('login button displays correct text', () => {
       expect(page.loginButton.nativeElement.textContent).toEqual('Log in');
    });

    it('register button displays correct text', () => {
        expect(page.registerButton.nativeElement.textContent).toEqual('Create your koffi account');
    });

    it('forgot password button displays correct text', () => {
        expect(page.forgotPasswordButton.nativeElement.textContent).toEqual('Forgot my password');
    });

    describe('navigates to', () => {
        let router: RouterStub;
        let routerSpy: Spy;

        beforeEach(() => {
            router = fixture.debugElement.injector.get(Router);
            routerSpy = spyOn(router, 'navigate').and.callThrough();
        });

        it('login when user presses log in', () => {
            page.usePressesLogIn();
            expect(routerSpy).toHaveBeenCalledTimes(1);
            expect(routerSpy).toHaveBeenCalledWith(['/login']);
        });

        it('register when user presses register', () => {
            page.usePressesRegister();
            expect(routerSpy).toHaveBeenCalledTimes(1);
            expect(routerSpy).toHaveBeenCalledWith(['/register']);
        });

        it('forgot password when user presses forgot password', () => {
            page.usePressesForgotPassword();
            expect(routerSpy).toHaveBeenCalledTimes(1);
            expect(routerSpy).toHaveBeenCalledWith(['/forgot-password']);
        });

    });

});