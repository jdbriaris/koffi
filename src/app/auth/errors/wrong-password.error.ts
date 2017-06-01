import {AuthError} from "./auth.error";

export class WrongPasswordError extends AuthError {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, WrongPasswordError.prototype);
    }
}