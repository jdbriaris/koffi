import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
    moduleId: 'module.id',
    templateUrl: 'register-review.component.html'
})
export class RegisterReviewComponent implements OnInit{
    email: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ){}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.email = params['email'];
        });
    };

    logIn(): void {
        this.router.navigate(['/login']);
    };

    register(): void {
        this.router.navigate(['/register']);
    };

    forgotPassword(): void {
        this.router.navigate(['/forgot-password']);
    };
}