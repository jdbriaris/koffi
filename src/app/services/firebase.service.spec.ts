import {FirebaseAuthStub} from "../testing/firebase.auth.stub";
import Auth = firebase.auth.Auth;
import {FirebaseService} from "./firebase.service";
import Spy = jasmine.Spy;
import {
    LogInError, AuthService, LoginCredentials, NewUser, CreateUserError, User,
    ResetPasswordError
} from "./auth.service";
import {fakeAsync, tick} from "@angular/core/testing";
import FirebaseUser = firebase.User;
import {FirebaseUserStub} from "../testing/firebase.user.stub";

describe('FirebaseService', () => {
    const email = 'someone@somewhere.com';
    const name = 'someone';
    const password = 'password';
    let firebaseAuth: Auth;
    let firebaseService: AuthService;
    let credentials: LoginCredentials;

    beforeEach(() => {
        firebaseAuth = new FirebaseAuthStub();
        firebaseService = new FirebaseService(firebaseAuth);
        credentials = {
            email: email,
            password: password
        };
    });

    it('on construction isUserLoggedIn returns false', () => {
       expect(firebaseService.isUserLoggedIn()).toBeFalsy();
    });

    describe('on logIn', () => {
        let spy: Spy;
        let user: User;
        const uid = 'uid';
        let firebaseUser: FirebaseUser;

        beforeEach(() => {
            spy = spyOn(firebaseAuth,  'signInWithEmailAndPassword');

            firebaseUser = new FirebaseUserStub();
            firebaseUser.displayName = name;
            firebaseUser.email = email;
            firebaseUser.uid = uid;
        });

        it('calls signInWithEmailAndPassword on firebase', () => {
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.logIn(credentials).subscribe();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(credentials.email, credentials.password);
        });

        it('returns user when firebase resolves with firebase user', fakeAsync(() => {
            let user = null;
            let expectedUser: User;
            expectedUser = {
                name: name,
                email: email,
                uid: uid
            };
            spy.and.returnValue(Promise.resolve(firebaseUser));
            firebaseService.logIn(credentials).subscribe(
                (u: User) => {
                    user = u;
                });
            tick();
            expect(user).toEqual(expectedUser);
        }));

        it('isUserLoggedIn returns true when firebase resolves', fakeAsync(() => {
            spy.and.returnValue(Promise.resolve(firebaseUser));
            firebaseService.logIn(credentials).subscribe();
            tick();
            expect(firebaseService.isUserLoggedIn()).toBeTruthy();
        }));

        it('returns UserNotFound when firebase rejects with user-not-found', fakeAsync(() => {
            let error = LogInError.Failed;
            spy.and.returnValue(Promise.reject({code:'auth/user-not-found', message:''}));
            firebaseService.logIn(credentials).subscribe(
                () => {},
                (err: LogInError) => {
                    error = err;
                });
            tick();
            expect(error).toEqual(LogInError.UserNotFound);
        }));

        it('returns UserNotFound when firebase rejects with invalid-email', fakeAsync(() => {
            let error = LogInError.Failed;
            spy.and.returnValue(Promise.reject({code: 'auth/invalid-email', message: ''}));
            firebaseService.logIn(credentials).subscribe(
                () => {},
                (res: LogInError) => {
                    error = res;
                });
            tick();
            expect(error).toEqual(LogInError.UserNotFound);
        }));

        it('returns WrongPassword when firebase rejects with wrong-password', fakeAsync(() => {
            let error = LogInError.Failed;
            spy.and.returnValue(Promise.reject({code: 'auth/wrong-password', message: ''}));
            firebaseService.logIn(credentials).subscribe(
                () => {},
                (res: LogInError) => {
                    error = res;
                });
            tick();
            expect(error).toEqual(LogInError.WrongPassword);
        }));

        it('returns Failed when firebase rejects with unknown error', fakeAsync(() => {
            let error = LogInError.UserNotFound;
            spy.and.returnValue(Promise.reject('some unknown error?!?!?'));
            firebaseService.logIn(credentials).subscribe(
                () => {},
                (res: LogInError) => {
                    error = res;
                });
            tick();
            expect(error).toEqual(LogInError.Failed);
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
        let user: User;

        beforeEach(() => {
            spy = spyOn(firebaseAuth,  'createUserWithEmailAndPassword');
            newUser = {
                name: name,
                email: email,
                password: password
            };
        });

        it('calls createUserWithEmailAndPassword on firebase', () => {
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.createUser(newUser).subscribe();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(newUser.email, newUser.password);
        });

        describe('and firebase resolves with firebase user', () => {
            const uid = 'uid';
            let firebaseUser: FirebaseUser;

            beforeEach(() => {
                firebaseUser = new FirebaseUserStub();
                firebaseUser.displayName = name;
                firebaseUser.email = email;
                firebaseUser.uid = uid;
            });

            it('return user when firebase resolves with firebase user', fakeAsync(() => {
                user = null;
                let expectedUser: User;
                expectedUser = {
                    name: name,
                    email: email,
                    uid: uid
                };
                spy.and.returnValue(Promise.resolve(firebaseUser));
                firebaseService.createUser(newUser).subscribe(
                    (u: User) => {
                        user = u;
                    });
                tick();
                expect(user).toEqual(expectedUser);
            }));

            it('sets isUserLoggedIn to true when firebase resolves with firebase user', fakeAsync(() => {
                expect(firebaseService.isUserLoggedIn()).toBeFalsy();
                spy.and.returnValue(Promise.resolve(firebaseUser));
                firebaseService.createUser(newUser).subscribe();
                tick();
                expect(firebaseService.isUserLoggedIn()).toBeTruthy();
            }));

        });

        it('returns EmailAlreadyRegistered when firebase rejects with email-already-in-use', fakeAsync(() => {
            err = CreateUserError.InvalidEmail;
            spy.and.returnValue(Promise.reject({code: 'auth/email-already-in-use', message: ''}));
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
            spy.and.returnValue(Promise.reject({code: 'auth/invalid-email', message: ''}));
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
            spy.and.returnValue(Promise.reject({code: 'auth/weak-password', message: ''}));
            firebaseService.createUser(newUser).subscribe(
                () => {},
                (res: CreateUserError) => {
                    err = res;
                });
            tick();
            expect(err).toEqual(CreateUserError.WeakPassword);
        }));

        it('returns Failed when firebase rejects with unknown error', fakeAsync(() => {
            err = CreateUserError.InvalidEmail;
            spy.and.returnValue(Promise.reject({code: 'some unknown string', message: ''}));
            firebaseService.createUser(newUser).subscribe(
                () => {},
                (res: CreateUserError) => {
                    err = res;
                });
            tick();
            expect(err).toEqual(CreateUserError.Failed);
        }));

    });

    describe('on resetPassword', () => {
        let spy: Spy;

        beforeEach(() => {
            spy = spyOn(firebaseAuth,  'sendPasswordResetEmail');
        });

        it('calls sendPasswordResetEmail on firebase', () => {
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.resetPassword(credentials.email).subscribe();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(credentials.email);
        });

        it('returns void when firebase resolves', fakeAsync(() => {
            let result = {something: 'something'};
            spy.and.returnValue(Promise.resolve({}));
            firebaseService.resetPassword(credentials.email).subscribe((res: any) => {
                result = res;
            });
            tick();
            expect(result).toBeUndefined();
        }));

        it('returns InvalidEmail when firebase rejects with auth/invalid-email', fakeAsync(() => {
            let result = ResetPasswordError.UserNotFound;
            let fbError = {code: 'auth/invalid-email', message: ''};
            spy.and.returnValue(Promise.reject(fbError));
            firebaseService.resetPassword(credentials.email).subscribe(
                () => {},
                (err: ResetPasswordError) => {
                    result = err;
                });
            tick();
            expect(result).toEqual(ResetPasswordError.InavlidEmail);
        }));

        it('returns UserNotFound when firebase rejects with auth/user-not-found', fakeAsync(() => {
            let result = ResetPasswordError.InavlidEmail;
            let fbError = {code: 'auth/user-not-found', message: ''};
            spy.and.returnValue(Promise.reject(fbError));
            firebaseService.resetPassword(credentials.email).subscribe(
                () => {},
                (err: ResetPasswordError) => {
                    result = err;
                });
            tick();
            expect(result).toEqual(ResetPasswordError.UserNotFound);
        }));

        it('returns Failed when firebase rejects with unknown error', fakeAsync(() => {
            let result = ResetPasswordError.InavlidEmail;
            spy.and.returnValue(Promise.reject('some unknown error'));
            firebaseService.resetPassword(credentials.email).subscribe(
                () => {},
                (err: ResetPasswordError) => {
                    result = err;
                });
            tick();
            expect(result).toEqual(ResetPasswordError.Failed);
        }));
    })

});