import {AuthError} from "../errors/auth.error";
import {UserNameError} from "../errors/username.error";
import {InvalidEmailError} from "../errors/invalid-email.error";
import {WrongPasswordError} from "../errors/wrong-password.error";
import {WeakPasswordError} from "../errors/weak-password.error";
import {EmailRegisteredError} from "../errors/email-registered.error";

export function mapFirebaseError(firebaseError: firebase.auth.Error) : AuthError {
    let code = firebaseError.code;
    let msg = firebaseError.message;
    switch (code) {
        case 'auth/user-not-found':
            return new UserNameError(msg);
        case 'auth/invalid-email':
            return new InvalidEmailError(msg);
        case 'auth/wrong-password':
            return new WrongPasswordError(msg);
        case 'auth/weak-password':
            return new WeakPasswordError(msg);
        case 'auth/email-already-in-use':
            return new EmailRegisteredError(msg);
        default:
            return new AuthError('Error logging into application');
    }
}
