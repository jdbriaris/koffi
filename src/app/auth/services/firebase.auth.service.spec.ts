import Auth = firebase.auth.Auth;
import {FirebaseAuthService} from "./firebase.auth.service";
import Spy = jasmine.Spy;
import FirebaseUser = firebase.User;
import Error = firebase.auth.Error;
import * as TypeMoq from 'typemoq';
import {User} from "../user";
import {MockUser} from "../testing/mock.user";
import { Credentials, NewUserCredentials } from "./auth.service";
import {AuthError} from "../errors/auth.error";
import {MockNgZone} from "../../testing/mock.ngzone";

describe('FirebaseAuthService', () => {
    let mockFirebaseAuthApp: TypeMoq.IMock<Auth>;
    let firebaseAuthService: FirebaseAuthService;

    beforeEach(() => {
        mockFirebaseAuthApp = TypeMoq.Mock.ofType<Auth>();
        firebaseAuthService = new FirebaseAuthService(mockFirebaseAuthApp.object, new MockNgZone());
    });

    describe('logIn', () => {
        let credentials: Credentials;

        beforeEach(() => {
            credentials = {email: MockUser.email, password: '******'};
        });

        it('returns user when firebase signInWithEmailAndPassword returns firebase user', (done) => {
            mockFirebaseAuthApp
                .setup(x => x.signInWithEmailAndPassword(credentials.email, credentials.password))
                .returns(() => Promise.resolve({email: MockUser.email, displayName: MockUser.name}));

            firebaseAuthService.logIn(credentials).subscribe(
                (res: User) => {
                    mockFirebaseAuthApp.verify(auth => auth.signInWithEmailAndPassword(
                        TypeMoq.It.isValue(credentials.email), TypeMoq.It.isValue(credentials.password)),
                        TypeMoq.Times.once());
                    expect(res).toEqual(MockUser);
                    done();
                }
            );
        });

        it('returns an AuthError when firebase signInWithEmailAndPassword returns error', (done) => {
            mockFirebaseAuthApp
                .setup(x => x.signInWithEmailAndPassword(credentials.email, credentials.password))
                .returns(() => Promise.reject(""));

            firebaseAuthService.logIn(credentials).subscribe(
                () => {},
                (err: AuthError) => {
                    mockFirebaseAuthApp.verify(auth => auth.signInWithEmailAndPassword(
                        TypeMoq.It.isValue(credentials.email), TypeMoq.It.isValue(credentials.password)),
                        TypeMoq.Times.once());
                    expect(err).toEqual(jasmine.any(AuthError));
                    done();
                }
            );
        });
    });

    describe('logOut', () => {
        it('calls next when firebase signOut returns void', (done) => {
            mockFirebaseAuthApp.setup(x => x.signOut()).returns(() => Promise.resolve() );

            firebaseAuthService.logOut().subscribe(
                () => {
                    mockFirebaseAuthApp.verify(auth => auth.signOut(), TypeMoq.Times.once());
                    done();
                }
            );
        });

        it('returns an AuthError when firebase signOut returns error', (done) => {
            mockFirebaseAuthApp.setup(x => x.signOut()).returns(() => Promise.reject("") );

            firebaseAuthService.logOut().subscribe(
                () => {},
                (err: AuthError) => {
                    mockFirebaseAuthApp.verify(auth => auth.signOut(), TypeMoq.Times.once());
                    expect(err).toEqual(jasmine.any(AuthError));
                    done();
                });
        });
    });

    describe('createNewUser', () => {
        let credentials: NewUserCredentials;

        beforeEach(() => {
            credentials = {email: MockUser.email, name: MockUser.name, password: '******'};
        });

        it('returns user when firebase createUserWithEmailAndPassword returns firebase user', (done) => {
            mockFirebaseAuthApp
                .setup(x => x.createUserWithEmailAndPassword(credentials.email, credentials.password))
                .returns(() => Promise.resolve({email: MockUser.email, displayName: MockUser.name}));

            firebaseAuthService.createNewUser(credentials).subscribe(
                (user: User) => {
                    mockFirebaseAuthApp.verify(auth => auth.createUserWithEmailAndPassword(
                        TypeMoq.It.isValue(credentials.email), TypeMoq.It.isValue(credentials.password)),
                        TypeMoq.Times.once());
                    expect(user).toEqual(MockUser);
                    done();
                });
        });

        it('returns an AuthError when firebase createUserWithEmailAndPassword returns error', (done) => {
            mockFirebaseAuthApp
                .setup(x => x.createUserWithEmailAndPassword(credentials.email, credentials.password))
                .returns(() => Promise.reject(""));

            firebaseAuthService.createNewUser(credentials).subscribe(
                () => {},
                (err: AuthError) => {
                    mockFirebaseAuthApp.verify(auth => auth.createUserWithEmailAndPassword(
                        TypeMoq.It.isValue(credentials.email), TypeMoq.It.isValue(credentials.password)),
                        TypeMoq.Times.once());
                    expect(err).toEqual(jasmine.any(AuthError));
                    done();
                });
        });
    });

    describe('resetPassword', () => {

        it('calls next when firebase sendPasswordResetEmail return void', (done) => {
            mockFirebaseAuthApp
                .setup(x => x.sendPasswordResetEmail(MockUser.email)).returns(() => Promise.resolve());

            firebaseAuthService.resetPassword(MockUser.email).subscribe(
                () => {
                    mockFirebaseAuthApp.verify(auth => auth.sendPasswordResetEmail(TypeMoq.It.isValue(MockUser.email)),
                        TypeMoq.Times.once());
                    done();
                });
        });

        it('returns an AuthError when firebase createUserWithEmailAndPassword returns error', (done) => {
            mockFirebaseAuthApp
                .setup(x => x.sendPasswordResetEmail(MockUser.email)).returns(() => Promise.reject(""));

            firebaseAuthService.resetPassword(MockUser.email).subscribe(
                () => {},
                (err: AuthError) => {
                    mockFirebaseAuthApp.verify(auth => auth.sendPasswordResetEmail(TypeMoq.It.isValue(MockUser.email)),
                        TypeMoq.Times.once());
                    expect(err).toEqual(jasmine.any(AuthError));
                    done();
                });
        });
    });

    describe('onUserLogInStateChanged', () => {
        let mockFirebaseUser: TypeMoq.IMock<FirebaseUser>;

        beforeAll(() => {
           mockFirebaseUser = TypeMoq.Mock.ofType<FirebaseUser>();
           mockFirebaseUser.setup(x => x.email).returns(() => MockUser.email);
           mockFirebaseUser.setup(x => x.displayName).returns(() => MockUser.name);
        });

        it('calls next with user when firebase onAuthStateChanged returns firebase user', (done) => {
            mockFirebaseAuthApp
                .setup(x => x.onAuthStateChanged(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .callback((fn1, fn2, fn3) => fn1(mockFirebaseUser.object));

            firebaseAuthService.onUserLogInStateChanged().subscribe(
                (user: User) => {
                    mockFirebaseAuthApp.verify(auth => auth.onAuthStateChanged(TypeMoq.It.isAny(),
                        TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
                    expect(user).toEqual(MockUser);
                    done();
                }
            );
        });

        it('calls next with undefined when firebase onAuthStateChanged returns undefined', (done) => {
            mockFirebaseAuthApp
                .setup(x => x.onAuthStateChanged(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .callback((fn1, fn2, fn3) => fn1());

            firebaseAuthService.onUserLogInStateChanged().subscribe(
                (user: User) => {
                    mockFirebaseAuthApp.verify(auth => auth.onAuthStateChanged(TypeMoq.It.isAny(),
                        TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
                    expect(user).toBeUndefined();
                    done();
                }
            );
        });

        it('returns an AuthError when firebase onAuthStateChanged returns an error', (done) => {
            mockFirebaseAuthApp
                .setup(x => x.onAuthStateChanged(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()))
                .callback((fn1, fn2, fn3) => fn2(""));

            firebaseAuthService.onUserLogInStateChanged().subscribe(
                () => {},
                (err: AuthError) => {
                    mockFirebaseAuthApp.verify(auth => auth.onAuthStateChanged(TypeMoq.It.isAny(),
                        TypeMoq.It.isAny(), TypeMoq.It.isAny()), TypeMoq.Times.once());
                    expect(err).toEqual(jasmine.any(AuthError));
                    done();
                }
            );
        });
    });
});
