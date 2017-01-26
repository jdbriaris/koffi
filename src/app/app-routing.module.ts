import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpReviewComponent} from "./sign-up-review/sign-up-review.component";

const routes: Routes = [
    {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
    {path: 'sign-in', component: SignInComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'sign-up-review', component: SignUpReviewComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}