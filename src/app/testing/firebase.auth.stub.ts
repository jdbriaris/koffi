import App = firebase.app.App;
import Auth = firebase.auth.Auth;
import {User} from "firebase/app";
import Error = firebase.auth.Error;

export class FirebaseAuthStub implements Auth {
    private onAuthStateChangedSuccess: (user: User) => {};
    private onAuthStateChangedError: (err: Error) => {};
    private onAuthStateChangedComplete: () => {};

    app: firebase.app.App;
    applyActionCode(code: string): firebase.Promise<any>{return null};
    checkActionCode(code: string): firebase.Promise<any>{return null};
    confirmPasswordReset(code: string, newPassword: string):firebase.Promise<any>{return null};
    createCustomToken(uid: string, developerClaims?: Object|null): string{return null};
    createUserWithEmailAndPassword(email: string, password: string): firebase.Promise<any>{return null};
    currentUser: firebase.User|null;
    fetchProvidersForEmail(email: string): firebase.Promise<any>{return null};
    getRedirectResult(): firebase.Promise<any>{return null};
    onAuthStateChanged(
        nextOrObserver: Object, error?: (a: firebase.auth.Error) => any,
        completed?: () => any): () => any{
            this.onAuthStateChangedSuccess = nextOrObserver as (user: User) => {};
            this.onAuthStateChangedError = error as (err: Error) => {};
            this.onAuthStateChangedComplete = completed as () => {};
            return null};
    sendPasswordResetEmail(email: string): firebase.Promise<any>{return null};
    signInAnonymously(): firebase.Promise<any>{return null};
    signInWithCredential(credential: firebase.auth.AuthCredential):
    firebase.Promise<any>{return null};
    signInWithCustomToken(token: string): firebase.Promise<any>{return null};
    signInWithEmailAndPassword(email: string, password: string): firebase.Promise<any>{return null;};
    signInWithPopup(provider: firebase.auth.AuthProvider):
    firebase.Promise<any>{return null};
    signInWithRedirect(provider: firebase.auth.AuthProvider):
    firebase.Promise<any>{return null};
    signOut(): firebase.Promise<any>{return null};
    verifyIdToken(idToken: string): firebase.Promise<any>{return null};
    verifyPasswordResetCode(code: string): firebase.Promise<any>{return null};


    executeOnAuthStateChangedSuccess(user: User): void {
        this.onAuthStateChangedSuccess(user);
    }

    executeOnAuthStateChangedError(err: Error): void {
        this.onAuthStateChangedError(err);
    }

    executeOnAuthStateChangedComplete(): void {
        this.onAuthStateChangedComplete();
    }
}

