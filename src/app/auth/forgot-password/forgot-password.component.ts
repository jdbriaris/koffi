import {Component, OnInit, NgZone, Inject} from "@angular/core";
import {FormGroup, FormBuilder, FormControl, Validators, AbstractControl} from "@angular/forms";
import {Router} from "@angular/router";
import '../../styles/forms.scss';
import {AuthService, AUTH_SERVICE} from "../services/auth.service";
import { AuthError } from "../errors/auth.error";
import { InvalidEmailError } from "../errors/invalid-email.error";
import { UserNotFoundError } from "../errors/user-not-found.error";

@Component({
    moduleId: 'module.id',
    templateUrl: 'forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
    public resetPasswordForm: FormGroup;
    private emailControl: FormControl;
    public formErrors = {
        email: ''
    };

    private validationMessages = {
        'email': {
            'required': () => this.updateFormError('email', 'Enter your email address')
        }
    };

    constructor(
        private formBuilder: FormBuilder,
        @Inject(AUTH_SERVICE) private authService: AuthService,
        private router: Router,
        private zone: NgZone
    ){}

    ngOnInit(): void {
        this.buildForm();
    };

    private buildForm(): void {
        this.emailControl = new FormControl('', [
            Validators.required
        ]);
        this.resetPasswordForm = this.formBuilder.group({
            email: this.emailControl
        });

        this.emailControl.valueChanges.subscribe(() => {
            this.cleanError('email');
        });
    };

    private updateFormError(field: string, msg: string): void {
        this.zone.run(() => {
            this.formErrors[field] = msg;
        });
    };

    private cleanError(error: string) {
        this.formErrors[error] = '';
    }

    private validateForm(): void {
        const form = this.resetPasswordForm;
        for (const field in this.formErrors) {
            const control: AbstractControl = form.get(field);
            for (const key in control.errors) {
                this.validationMessages[field][key]();
            }
        }
    };

    continue(): void {
        this.validateForm();

        if(this.resetPasswordForm.invalid){
            return;
        }

        this.authService.resetPassword(this.emailControl.value)
            .subscribe(
                //TODO - determine where to direct the user here
                () => {},
                (err: AuthError) => {
                    switch (err.constructor) {
                        case InvalidEmailError:
                            this.emailControl.setValue('');
                            this.updateFormError('email', 'Enter a valid email address');
                            break;
                        case UserNotFoundError:
                            this.emailControl.setValue('');
                            this.updateFormError('email', 'Sorry, there is no user registered with that email');
                            break;
                        default:
                            throw err;
                    }
                }
                );
    };
}