import {Component, OnInit, NgZone, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import '../styles/forms.scss';
import {AuthService, AUTH_SERVICE, CreateUserError, NewUser, User, LoginCredentials} from "../services/auth.service";

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

    register(newUser: NewUser): void {
        this.validateForm();
        if (this.registerForm.invalid) return;

        this.authService.createUser(newUser)
            .subscribe(
                (user: User) => {
                    this.router.navigate(['/home']);
                },
                (err: CreateUserError) => {
                    switch (err) {
                        case CreateUserError.EmailAlreadyRegistered:
                            this.router.navigate(['/register-review']);
                            break;
                        case CreateUserError.InvalidEmail:
                            this.passwordControl.setValue('');
                            this.updateFormError('email', 'Enter a valid email address');
                            break;
                        case CreateUserError.WeakPassword:
                            this.passwordControl.setValue('');
                            this.updateFormError('password', 'Enter a stronger password');
                            break;
                        case CreateUserError.Failed:
                            this.router.navigate(['/error']);
                            break;
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

    private navigateTo(url: string): void {
        this.router.navigate(([url]));
    }

    logIn(): void {
        this.navigateTo('/login');
    };
}