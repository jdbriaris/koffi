import {Component, OnInit, NgZone, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {NewUser} from "../domain/user.interface";
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import '../styles/forms.scss';
import {AuthErrorCode, AuthError} from "../services/auth.error";
import {AuthService, AUTH_SERVICE} from "../services/auth.service";

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
            // this.authService.createUser(newUser).subscribe(
            //     ()=> {
            //         console.log('success');
            //     },
            //     (error: AuthError) => {
            //         switch (error.code){
            //             case AuthErrorCode.EmailInUse:
            //                 this.navigateTo('/sign-up-review');
            //                 break;
            //             case AuthErrorCode.InvalidEmail:
            //                 this.updateFormError('email',   'Enter a valid email address');
            //                 break;
            //             case AuthErrorCode.InvalidPassword:
            //                 this.updateFormError('password', 'Enter a stronger password');
            //                 break;
            //             default:
            //                 //TODO: Work out where to navigate to here
            //                 console.log(error.message);
            //                 this.navigateTo('/login');
            //                 break;
            //         }
            //     });
    };

    private validateForm() {
        const form = this.registerForm;
        for (const field in this.formErrors) {
            const control: AbstractControl = form.get(field);
            for (const key in control.errors) {
                //TODO: Find more strongly-typed way of doing this
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

    signIn(): void {
        this.navigateTo('/login');
    };
}