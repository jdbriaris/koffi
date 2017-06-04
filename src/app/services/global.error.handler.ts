import { Injectable, ErrorHandler } from '@angular/core';
import {AuthError} from "../auth/errors/auth.error";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: any): void {

        if (error instanceof AuthError) {
            console.log('Hi');
        }
        else {
            console.log('Bye');
        }

    };
}

