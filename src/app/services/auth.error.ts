export enum AuthErrorCode {
    EmailInUse,
    InvalidEmail,
    InvalidPassword,
    NetworkRequestFailure,
    Unknown
}

export class AuthError {
    constructor(
        public code: AuthErrorCode,
        public message: string
    ) {}
}