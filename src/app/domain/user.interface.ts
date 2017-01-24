export interface NewUser {
    name: string;
    email: string;
    password: string;
}

export class User {
    constructor(
        public displayName: string,
        public email: string,
        public emailVerified: boolean,
        public uid: string
    ) {}
}