import {AuthError} from "./auth.error";

export class EmailRegisteredError extends AuthError {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, EmailRegisteredError.prototype);
    }
}