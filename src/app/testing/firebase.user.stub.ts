import User = firebase.User;

export class FirebaseUserStub implements User {
    displayName: string|null;
    email: string|null;
    photoURL: string|null;
    providerId: string;
    uid: string;
    delete(): firebase.Promise<any>{return null;}
    emailVerified: boolean;
    getToken(forceRefresh?: boolean): firebase.Promise<any>{return null;}
    isAnonymous: boolean;
    link(credential: firebase.auth.AuthCredential): firebase.Promise<any>{return null;}
    linkWithPopup(provider: firebase.auth.AuthProvider): firebase.Promise<any>{return null;}
    linkWithRedirect(provider: firebase.auth.AuthProvider):firebase.Promise<any>{return null;}
    providerData: (firebase.UserInfo|null)[];
    reauthenticate(credential: firebase.auth.AuthCredential):firebase.Promise<any>{return null;}
    refreshToken: string;
    reload(): firebase.Promise<any>{return null;}
    sendEmailVerification(): firebase.Promise<any>{return null;}
    unlink(providerId: string): firebase.Promise<any>{return null;}
    updateEmail(newEmail: string): firebase.Promise<any>{return null;}
    updatePassword(newPassword: string): firebase.Promise<any>{return null;}
    updateProfile(profile: {displayName: string | null, photoURL: string|null}):firebase.Promise<any>{return null};
}
