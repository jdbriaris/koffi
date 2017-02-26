import {Component, OnInit, NgZone, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, FormControl, Validators, AbstractControl} from "@angular/forms";
import '../styles/forms.scss';
import {AuthService, AUTH_SERVICE, LogInResult} from "../services/auth.service";

interface LoginCredentials {
    email: string,
    password: string
}

@Component({
    moduleId: 'module.id',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public formErrors = {
        email: '',
        password: ''
    };
    public logInError: string;

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
        @Inject(AUTH_SERVICE) private authService: AuthService,
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
        this.loginForm = this.formBuilder.group({
            email: this.emailControl,
            password: this.passwordControl
        });
    };

    private validateForm(): void {
        const form = this.loginForm;
         for (const field in this.formErrors) {
             const control: AbstractControl = form.get(field);
             for (const key in control.errors) {
                 this.validationMessages[field][key]();
             }
         }
    };

    private updateFormError(field: string, msg: string): void {
        this.zone.run(() => {
            this.formErrors[field] = msg;
        });
    };

    private updateLogInError(msg: string): void {
        this.zone.run(() => {
            this.logInError = msg;
        });
    };

    logIn(): void {
        this.validateForm();

        if(this.loginForm.invalid){
            return;
        }

        this.authService.logIn().subscribe((result: LogInResult) => {
            switch (result){
                case LogInResult.Success:
                    this.router.navigate(['/home']);
                    break;
                case LogInResult.Failed:
                    this.updateLogInError('There was a problem logging in');
                    this.passwordControl.setValue('');
                    break;
            }
        });
    };

    register(): void {
        this.router.navigate(['/register']);
    };
}


