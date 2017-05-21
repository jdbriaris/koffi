import {Component, OnInit, NgZone, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, FormControl, Validators, AbstractControl} from "@angular/forms";
import '../../styles/forms.scss';
import {AuthService, AUTH_SERVICE, LogInError, LoginCredentials} from "../services/auth.service";
import {User} from "../user";

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
        private route: ActivatedRoute,
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

        this.emailControl.valueChanges.subscribe(() => {this.cleanError('email')});
        this.passwordControl.valueChanges.subscribe(() => {this.cleanError('password')});
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

    private cleanError(error: string) {
        this.formErrors[error] = '';
    }

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

        let credentials: LoginCredentials;
        credentials = {
            email: this.emailControl.value,
            password: this.passwordControl.value
        };

        this.authService.logIn(credentials).subscribe(
            (user: User) => {
                this.router.navigate(['home'], {relativeTo: this.route.root});
            },
            (err: LogInError) => {
                switch (err) {
                    case LogInError.UserNotFound:
                        this.emailControl.setValue('');
                        this.passwordControl.setValue('');
                        this.updateFormError('email', 'Sorry, there is no user registered with that email');
                        break;
                    case LogInError.WrongPassword:
                        this.passwordControl.setValue('');
                        this.updateFormError('email', 'Your password is incorrect');
                        break;
                    case LogInError.Failed:
                        this.passwordControl.setValue('');
                        this.updateLogInError('There was a problem logging in');
                        break;
                }
        });
    };

    register(): void {
        this.router.navigate(['register'], {relativeTo: this.route.parent});
    };

    forgotPassword(): void {
        this.router.navigate(['forgot-password'], {relativeTo: this.route.parent});
    };
}


