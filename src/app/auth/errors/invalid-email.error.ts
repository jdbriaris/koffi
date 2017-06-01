import {AuthError} from "./auth.error";

export class InvalidEmailError extends AuthError {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidEmailError.prototype);
    }
}