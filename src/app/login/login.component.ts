import {Component, OnInit, NgZone, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, FormControl, Validators, AbstractControl} from "@angular/forms";
import '../styles/forms.scss';
import {AuthService, AUTH_SERVICE} from "../services/auth.service";

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

    private validateForm(): boolean {
        let isValid = true;
        const form = this.loginForm;
         for (const field in this.formErrors) {
             const control: AbstractControl = form.get(field);
             for (const key in control.errors) {

                 isValid = key.length > 0;

                 this.validationMessages[field][key]();

             }
         }
         return isValid;
    };

    private updateFormError(field: string, msg: string): void {
        this.zone.run(() => {
            this.formErrors[field] = msg;
        });
    };

    logIn(): void {

        if(!this.validateForm())
            return;

        this.authService.logIn().subscribe(() => {
            // this.router.navigate(['/home']);
        });

        //this.router.navigate(['/koffi']);
    };

    register(): void {
        //this.router.navigate(['/register']);
    };
}


