import {Component, OnInit, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {FormGroup, FormBuilder, FormControl, Validators, AbstractControl} from "@angular/forms";
import '../styles/forms.scss';

interface SignInCredentials {
    email: string,
    password: string
}

@Component({
    moduleId: 'module.id',
    templateUrl: 'login.component.html'
})
export class SignInComponent implements OnInit {
    public signInForm: FormGroup;
    public formErrors = {
        email: '',
        password: ''
    };

    private emailControl: FormControl;
    private passwordControl: FormControl;
    private validationMessages = {
        'email': {
            'required': () => this.updateFormError('email', 'Enter your email address')
        },
        'password': {
            'required': () => this.updateFormError('password', 'Enter your password')
        }
    };

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private zone: NgZone
    ) {}

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {
        this.emailControl = new FormControl('', [
            Validators.required
        ]);
        this.passwordControl = new FormControl('', [
            Validators.required
        ]);
        this.signInForm = this.formBuilder.group({
            email: this.emailControl,
            password: this.passwordControl
        });
    };

    private validateForm(): void {
        const form = this.signInForm;
        for (const field in this.formErrors) {
            const control: AbstractControl = form.get(field);
            for (const key in control.errors) {
                //TODO: Find more strongly-typed way of doing this
                this.validationMessages[field][key]();
            }
        }
    };

    private updateFormError(field: string, msg: string): void {
        this.zone.run(() => {
            this.formErrors[field] = msg;
        });
    };

    signIn(credentials: SignInCredentials): void {
        this.validateForm();

        // this.authService.signIn().subscribe(() => {
        //     this.router.navigate(['/home']);
        // });

        this.router.navigate(['/koffi']);

    };

    register(): void {
        this.router.navigate(['/register']);
    };
}


