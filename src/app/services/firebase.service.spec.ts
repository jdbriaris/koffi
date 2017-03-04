import {FirebaseAuthStub} from "../testing/firebase.app.stub";
import Auth = firebase.auth.Auth;
import {FirebaseService} from "./firebase.service";
import Spy = jasmine.Spy;
import {LogInResult, AuthService, LoginCredentials, NewUser, CreateUserError} from "./auth.service";
import {fakeAsync, tick} from "@angular/core/testing";

describe('FirebaseService', () => {
    let firebaseAuth: Auth;
    let firebaseService: AuthService;
    let credentials: LoginCredentials;

    beforeEach(() => {
        firebaseAuth = new FirebaseAuthStub();
        firebaseService = new FirebaseService(firebaseAuth);
        credentials = {
            email: 'someone@somewhere.com',
            password: 'password'
        };
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

        it('calls signInWithEmailAndPassword on firebase', () => {
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.logIn(credentials).subscribe();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(credentials.email, credentials.password);
        });

        it('returns Success when firebase resolves', fakeAsync(() => {
            result = LogInResult.Failed;
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.logIn(credentials).subscribe((res: LogInResult) => {
                result = res;
            });
            tick();
            expect(result).toEqual(LogInResult.Success);
        }));

        it('isUserLoggedIn returns true when firebase resolves', fakeAsync(() => {
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.logIn(credentials).subscribe();
            tick();
            expect(firebaseService.isUserLoggedIn()).toBeTruthy();
        }));

        it('returns UserNotFound when firebase rejects with user-not-found', fakeAsync(() => {
            result = LogInResult.Success;
            spy.and.returnValue(Promise.reject('auth/user-not-found'));
            firebaseService.logIn(credentials).subscribe(
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
            firebaseService.logIn(credentials).subscribe(
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
            firebaseService.logIn(credentials).subscribe(
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
            firebaseService.logIn(credentials).subscribe(
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

        it('isUserLoggedIn returns false when firebase signOut resolves', fakeAsync(() => {
            spySignIn.and.returnValue(Promise.resolve({}));
            spySignOut.and.returnValue(Promise.resolve({}));
            firebaseService.logIn(credentials).subscribe();
            tick();
            firebaseService.logOut();
            tick();
            expect(firebaseService.isUserLoggedIn()).toBeFalsy();
        }));
    });

    describe('on createUser', () => {
        let spy: Spy;
        let newUser: NewUser;
        let err: CreateUserError;

        beforeEach(() => {
            spy = spyOn(firebaseAuth,  'createUserWithEmailAndPassword');
            newUser = {
                name: 'name',
                email: 'email',
                password: 'password'
            };
        });

        it('calls createUserWithEmailAndPassword on firebase', () => {
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.createUser(newUser).subscribe();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(newUser.email, newUser.password);
        });

        it('returns EmailAlreadyRegistered when firebase rejects with email-already-in-use', fakeAsync(() => {
            err = CreateUserError.InvalidEmail;
            spy.and.returnValue(Promise.reject('auth/email-already-in-use'));
            firebaseService.createUser(newUser).subscribe(
                () => {},
                (res: CreateUserError) => {
                    err = res;
                });
            tick();
            expect(err).toEqual(CreateUserError.EmailAlreadyRegistered);
        }));

        it('returns InvalidEmail when firebase rejects with invalid-email', fakeAsync(() => {
            err = CreateUserError.EmailAlreadyRegistered;
            spy.and.returnValue(Promise.reject('auth/invalid-email'));
            firebaseService.createUser(newUser).subscribe(
                () => {},
                (res: CreateUserError) => {
                    err = res;
                });
            tick();
            expect(err).toEqual(CreateUserError.InvalidEmail);
        }));

        it('returns WeakPassword when firebase rejects with weak-password', fakeAsync(() => {
            err = CreateUserError.EmailAlreadyRegistered;
            spy.and.returnValue(Promise.reject('auth/weak-password'));
            firebaseService.createUser(newUser).subscribe(
                () => {},
                (res: CreateUserError) => {
                    err = res;
                });
            tick();
            expect(err).toEqual(CreateUserError.WeakPassword);
        }));

    });

});