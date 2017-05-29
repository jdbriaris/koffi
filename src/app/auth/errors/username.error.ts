import {AuthError} from "./auth.error";

export class UserNameError extends AuthError {
    constructor(message?: string) {
        super(message);
    }
}
