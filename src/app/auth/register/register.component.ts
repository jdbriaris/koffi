import {Component, OnInit, NgZone, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import '../../styles/forms.scss';
import {AuthService, AUTH_SERVICE, Credentials, NewUserCredentials} from "../services/auth.service";
import {AuthError} from "../errors/auth.error";
import {EmailRegisteredError} from "../errors/email-registered.error";
import {InvalidEmailError} from "../errors/invalid-email.error";
import {WeakPasswordError} from "../errors/weak-password.error";

@Component({
    moduleId: 'module.id',
    templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    formErrors = {
        name: '',
        email: '',
        password: ''
    };

    validationActions = {
        'name': {
            'required': () => this.updateFormError('name', 'Enter your name')
        },
        'email': {
            'required': () => this.updateFormError('email', 'Enter your email address')
        },
        'password': {
            'required': () => this.updateFormError('password', 'Enter your password'),
            'minlength': () => this.updateFormError('password',   'Password must be at least 6 characters long')
        }
    };

    private nameControl: FormControl;
    private emailControl: FormControl;
    private passwordControl: FormControl;

    constructor(
        @Inject(AUTH_SERVICE) private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private ngZone: NgZone
    ) {}

    ngOnInit(): void {
        this.buildForm();
    }

    private buildForm(): void {

        this.nameControl = new FormControl('', [
            Validators.required
        ]);
        this.emailControl = new FormControl('', [
            Validators.required
        ]);
        this.passwordControl = new FormControl('', [
            Validators.required,
            Validators.minLength(6)
        ]);

        this.registerForm = this.formBuilder.group({
            name: this.nameControl,
            email: this.emailControl,
            password: this.passwordControl
        });

        this.nameControl.valueChanges.subscribe(() => this.nameValueChanged());
        this.emailControl.valueChanges.subscribe(() => this.emailValueChanged());
        this.passwordControl.valueChanges.subscribe(() => this.passwordValueChanged());
    }

    private nameValueChanged(){
        this.clearError('name');
    }

    private emailValueChanged(){
        this.clearError('email');
    }

    private passwordValueChanged(){
        this.clearError('password');
    }

    private clearError(error: string) {
        this.formErrors[error] = '';
    }

    register(credentials: NewUserCredentials): void {
        this.validateForm();
        if (this.registerForm.invalid) return;

        this.authService.createNewUser(credentials)
            .subscribe(
                () => {
                    this.router.navigate(['home'], {relativeTo: this.route.root});
                },
                (err: AuthError) => {
                    switch (err.constructor) {
                        case EmailRegisteredError:
                            this.router.navigate(['register-review', this.emailControl.value],
                                {relativeTo: this.route.parent});
                            break;
                        case InvalidEmailError:
                            this.passwordControl.setValue('');
                            this.updateFormError('email', 'Enter a valid email address');
                            break;
                        case WeakPasswordError:
                            this.passwordControl.setValue('');
                            this.updateFormError('password', 'Enter a stronger password');
                            break;
                        default:
                            throw err;
                    }
                });
    };

    private validateForm() {
        const form = this.registerForm;
        for (const field in this.formErrors) {
            const control: AbstractControl = form.get(field);
            for (const key in control.errors) {
                this.validationActions[field][key]();
            }
        }
    };

    private updateFormError(key: string, msg: string): void {
        this.ngZone.run(() => {this.formErrors[key] = msg;});
    };

    logIn(): void {
        this.router.navigate(['login'], {relativeTo: this.route.parent});
    };
}