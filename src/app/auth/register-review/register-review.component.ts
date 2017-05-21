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
        this.router.navigate(['login'], {relativeTo: this.route.parent});
    };

    register(): void {
        this.router.navigate(['register'], {relativeTo: this.route.parent});
    };

    forgotPassword(): void {
        this.router.navigate(['forgot-password'], {relativeTo: this.route.parent});
    };
}