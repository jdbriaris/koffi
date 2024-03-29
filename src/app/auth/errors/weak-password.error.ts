import {AuthError} from "./auth.error";

export class WeakPasswordError extends AuthError {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, WeakPasswordError.prototype);
    }
}