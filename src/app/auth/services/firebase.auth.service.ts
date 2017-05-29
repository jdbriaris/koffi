import {Injectable, Inject, NgZone} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { AuthService, Credentials } from "./auth.service";
import {FIREBASE_AUTH} from "./firebase.auth.provider";
import Auth = firebase.auth.Auth;
import FirebaseUser = firebase.User;
import Error = firebase.auth.Error;
import {Observer} from "rxjs/Observer";
import {observeOn} from "rxjs/operator/observeOn";
import {ZoneScheduler} from "../../utils/utils";
import {User} from "../user";
import {mapFirebaseError} from "./firebase.utils";

@Injectable()
export class FirebaseAuthService implements AuthService {
    constructor(
        @Inject(FIREBASE_AUTH) private firebaseApp: Auth,
        private zone: NgZone
    ) {}

    onUserLogInStateChanged(): Observable<User> {
        const logInState = Observable.create((observer: Observer<User>) => {
            this.firebaseApp.onAuthStateChanged(
                (user?: firebase.User) => {
                    if (user) {
                        observer.next(FirebaseAuthService.createUser(user));
                    } else {
                        observer.next(undefined);
                    }
                },
                (err: firebase.auth.Error) => observer.error(mapFirebaseError(err)),
                () => observer.complete()
            )
        });
        return observeOn.call(logInState, new ZoneScheduler(this.zone));
    };

    logIn(credentials: Credentials): Observable<User> {
        return Observable.create(obs => {
            this.firebaseApp.signInWithEmailAndPassword(credentials.email, credentials.password)
                .then((res: any) => {
                    let user = FirebaseAuthService.createUser(res as firebase.User);
                    obs.next(user);
                })
                .catch((err: any) => {
                    let error = mapFirebaseError(err);
                    obs.error(error);
                });
        });
    };

    logOut(): Observable<void> {
        return Observable.create(obs => {
            this.firebaseApp.signOut()
                .then(() => {
                    obs.next();
                })
                .catch((err: any) => {
                    let error = mapFirebaseError(err);
                    obs.error(error);
                })
        });
    };

    createNewUser(credentials: Credentials): Observable<User> {
        return Observable.create(obs => {
            this.firebaseApp.createUserWithEmailAndPassword(credentials.email, credentials.password)
                .then((res: FirebaseUser) => {
                    let user = FirebaseAuthService.createUser(res);
                    obs.next(user);
                })
                .catch((err: any) => {
                    let error = mapFirebaseError(err);
                    obs.error(error);
            });
        });
    };

    resetPassword(email: string): Observable<void> {
        return Observable.create(obs => {
            this.firebaseApp.sendPasswordResetEmail(email)
                .then(() => {
                    obs.next();
                    })
                .catch((err: any) => {
                    let error =  mapFirebaseError(err);
                    obs.error(error);
                });
        });
    };

    private static createUser(fbUser: firebase.User) : User {
        let user: User;
        user = {
            email: fbUser.email,
            name: fbUser.displayName
        };
        return user;
    };
}
