import {AuthError} from "./auth.error";

export class UserNotFoundError extends AuthError {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
    }
}
