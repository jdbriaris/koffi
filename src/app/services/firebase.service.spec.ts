import {FirebaseAuthStub} from "../testing/firebase.app.stub";
import Auth = firebase.auth.Auth;
import {FirebaseService} from "./firebase.service";
import Spy = jasmine.Spy;
import {LogInResult, AuthService} from "./auth.service";
import {fakeAsync, tick} from "@angular/core/testing";

describe('FirebaseService', () => {
    let firebaseAuth: Auth;
    let firebaseService: AuthService;

    beforeEach(() => {
        firebaseAuth = new FirebaseAuthStub();
        firebaseService = new FirebaseService(firebaseAuth);
    });

    it('on construction isUserLoggedIn returns false', () => {
       expect(firebaseService.isUserLoggedIn()).toBeFalsy();
    });

    describe('on logIn', () => {
        let spy: Spy;
        let result: LogInResult;

        beforeEach(() => {
            spy = spyOn(firebaseAuth,  'signInWithEmailAndPassword');
        });

        it('returns Success when firebase resolves', fakeAsync(() => {
            result = LogInResult.Failed;
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.logIn().subscribe((res: LogInResult) => {
                result = res;
            });
            tick();
            expect(result).toEqual(LogInResult.Success);
        }));

        it('isUserLoggedIn returns true when firebase resolves', fakeAsync(() => {
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.logIn().subscribe();
            tick();
            expect(firebaseService.isUserLoggedIn()).toBeTruthy();
        }));

        it('returns UserNotFound when firebase rejects with user-not-found', fakeAsync(() => {
            result = LogInResult.Success;
            spy.and.returnValue(Promise.reject('auth/user-not-found'));
            firebaseService.logIn().subscribe(
                () => {},
                (res: LogInResult) => {
                    result = res;
                });
            tick();
            expect(result).toEqual(LogInResult.UserNotFound);
        }));

        it('returns UserNotFound when firebase rejects with invalid-email', fakeAsync(() => {
            result = LogInResult.Success;
            spy.and.returnValue(Promise.reject('auth/invalid-email'));
            firebaseService.logIn().subscribe(
                () => {},
                (res: LogInResult) => {
                    result = res;
                });
            tick();
            expect(result).toEqual(LogInResult.UserNotFound);
        }));

        it('returns WrongPassword when firebase rejects with wrong-password', fakeAsync(() => {
            result = LogInResult.Success;
            spy.and.returnValue(Promise.reject('auth/wrong-password'));
            firebaseService.logIn().subscribe(
                () => {},
                (res: LogInResult) => {
                    result = res;
                });
            tick();
            expect(result).toEqual(LogInResult.WrongPassword);
        }));

        it('returns Failed when firebase rejects with unknown error', fakeAsync(() => {
            result = LogInResult.Success;
            spy.and.returnValue(Promise.reject('some unknown error?!?!?'));
            firebaseService.logIn().subscribe(
                () => {},
                (res: LogInResult) => {
                    result = res;
                });
            tick();
            expect(result).toEqual(LogInResult.Failed);
        }));
    });

    describe('on logOut', () => {
        let spySignOut: Spy;
        let spySignIn: Spy;

        beforeEach(() => {
            spySignOut = spyOn(firebaseAuth,  'signOut');
            spySignIn = spyOn(firebaseAuth,  'signInWithEmailAndPassword');
        });

        it('isUserLoggedIn returns false when user logs out', fakeAsync(() => {
            spySignIn.and.returnValue(Promise.resolve({}));
            spySignOut.and.returnValue(Promise.resolve({}));
            firebaseService.logIn().subscribe();
            tick();
            firebaseService.logOut();
            tick();
            expect(firebaseService.isUserLoggedIn()).toBeFalsy();
        }));
    });

});