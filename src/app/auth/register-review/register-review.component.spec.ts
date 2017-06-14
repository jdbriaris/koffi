import {async, TestBed, ComponentFixture, inject} from "@angular/core/testing";
import {RegisterReviewComponent} from "./register-review.component";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import Spy = jasmine.Spy;
import createSpyObj = jasmine.createSpyObj;
import {MockRouter} from "../../testing/mock.router";
import {MockActivatedRoute} from "../../testing/mock.activated.route";
import {MockUser} from "../testing/mock.user";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

//region Test Vars
let component: RegisterReviewComponent;
let fixture: ComponentFixture<RegisterReviewComponent>;
let page: Page;
//endregion

//region Tests
describe('RegisterReviewComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterReviewComponent],
            providers: [
                {provide: ActivatedRoute, useClass: MockActivatedRoute},
                {provide: Router, useClass: MockRouter}
            ]
        }).compileComponents();
    }));

    beforeEach(async(() => {
        createComponent();
    }));

    describe('on initialize should render', initializeTests);
    describe('user presses', buttonActionTests);
});

function initializeTests(): void {
    it('correct message to user', () => {
        let expectedMsg = 'Looks like an account already exists with email ' + MockUser.email;
        expect(page.registerMessage.textContent).toBe(expectedMsg);
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
}
function buttonActionTests(): void {

    it('logIn, calls router to navigate to login',
        inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
            const spy = spyOn(router, 'navigate');
            spyOnProperty(route, 'parent', 'get').and.returnValue('parent');

            page.userPressesLogIn();

            expect(spy).toHaveBeenCalledWith(['login'], {relativeTo: 'parent'});
    }));

    it('register, calls router to navigate to register',
        inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
            const spy = spyOn(router, 'navigate');
            spyOnProperty(route, 'parent', 'get').and.returnValue('parent');

            page.userPressesRegister();

            expect(spy).toHaveBeenCalledWith(['register'], {relativeTo: 'parent'});
        }));

    it('forgotPassword, calls router to navigate to forgot-password',
        inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
            const spy = spyOn(router, 'navigate');
            spyOnProperty(route, 'parent', 'get').and.returnValue('parent');

            page.userPressesForgotPassword();

            expect(spy).toHaveBeenCalledWith(['forgot-password'], {relativeTo: 'parent'});
        }));

}
//endregion

//region Helpers
/** Create RegisterReviewComponent, initialize it and set the test variables */
function createComponent(): Promise<void> {
    fixture = TestBed.createComponent(RegisterReviewComponent);
    component = fixture.componentInstance;
    page = new Page();

    let params: Params = { 'email': MockUser.email };
    let activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    activatedRoute.params = new BehaviorSubject<Params>(params).asObservable();

    // Invoke ngOnIt
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
        page.addPageElements();
    });
}

class Page {
    registerMessage: HTMLElement;
    loginButton: DebugElement;
    registerButton: DebugElement;
    forgotPasswordButton: DebugElement;

    public addPageElements(): void {
        this.registerMessage = fixture.debugElement.query(By.css('span')).nativeElement;
        this.loginButton = fixture.debugElement.query(By.css('#login-button'));
        this.registerButton = fixture.debugElement.query(By.css('#register-button'));
        this.forgotPasswordButton = fixture.debugElement.query(By.css('#forgot-password'));
    };

    userPressesLogIn(): Page {
        this.loginButton.triggerEventHandler('click', null);
        return this;
    };

    userPressesRegister(): Page {
        this.registerButton.triggerEventHandler('click', null);
        return this;
    };

    userPressesForgotPassword(): Page {
        this.forgotPasswordButton.triggerEventHandler('click', null);
        return this;
    };
}
//endregion


//     //
//     // describe('navigates to', () => {
//     //     let router: RouterStub;
//     //     let routerSpy: Spy;
//     //
//     //     beforeEach(() => {
//     //         router = fixture.debugElement.injector.get(Router);
//     //         routerSpy = spyOn(router, 'navigate').and.callThrough();
//     //     });
//     //
//     //     it('login when user presses log in', () => {
//     //         page.userPressesLogIn();
//     //         expect(routerSpy).toHaveBeenCalledTimes(1);
//     //         expect(routerSpy).toHaveBeenCalledWith(['login'], {relativeTo: activatedRoute.parent});
//     //     });
//     //
//     //     it('register when user presses register', () => {
//     //         page.userPressesRegister();
//     //         expect(routerSpy).toHaveBeenCalledTimes(1);
//     //         expect(routerSpy).toHaveBeenCalledWith(['register'], {relativeTo: activatedRoute.parent});
//     //     });
//     //
//     //     it('forgot password when user presses forgot password', () => {
//     //         page.userPressesForgotPassword();
//     //         expect(routerSpy).toHaveBeenCalledTimes(1);
//     //         expect(routerSpy).toHaveBeenCalledWith(['forgot-password'], {relativeTo: activatedRoute.parent});
//     //     });
//     //
//     // });
//
// });